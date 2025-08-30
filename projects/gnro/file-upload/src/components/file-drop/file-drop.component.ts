import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  input,
  NgZone,
  OnDestroy,
  output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { FileSystemDirectoryEntry, FileSystemEntry, FileSystemFileEntry } from './dom.types';
import { GnroFileDropEntry } from './file-drop-entry';
import { GnroFileDropContentTemplateDirective } from './templates.directive';

@Component({
  selector: 'gnro-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslatePipe],
})
export class GnroFileDropComponent<T> implements OnDestroy {
  accept = input<string>('*');
  directory = input<boolean>(false);
  multiple = input<boolean>(true);
  dropZoneLabel = input<string>('');
  dropZoneClassName = input<string>('gnro-file-drop__drop-zone');
  useDragEnter = input<boolean>(false);
  contentClassName = input<string>('gnro-file-drop__content');
  showBrowseBtn = input<boolean>(false);
  browseBtnClassName = input<string>('btn btn-primary btn-xs gnro-file-drop__browse-btn');
  browseBtnLabel = input<string>('Browse files');
  disabled = input<boolean>(false);
  onFileDrop = output<GnroFileDropEntry[]>();
  onFileOver = output<DragEvent | Event>();
  onFileLeave = output<Event>();

  @ContentChild(GnroFileDropContentTemplateDirective, { read: TemplateRef }) contentTemplate?: TemplateRef<T>;
  @ViewChild('fileSelector', { static: true }) public fileSelector?: ElementRef;

  public isDraggingOverDropZone: boolean = false;
  private globalDraggingInProgress: boolean = false;
  private readonly globalDragStartListener: () => void;
  private readonly globalDragEndListener: () => void;
  private files: GnroFileDropEntry[] = [];
  private numOfActiveReadEntries: number = 0;
  private helperFormEl: HTMLFormElement | null = null;
  private fileInputPlaceholderEl: HTMLDivElement | null = null;
  private dropEventTimerSubscription: Subscription | null = null;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
  ) {
    this.globalDragStartListener = this.renderer.listen('document', 'dragstart', (evt: Event) => {
      this.globalDraggingInProgress = true;
    });
    this.globalDragEndListener = this.renderer.listen('document', 'dragend', (evt: Event) => {
      this.globalDraggingInProgress = false;
    });
  }

  public ngOnDestroy(): void {
    if (this.dropEventTimerSubscription) {
      this.dropEventTimerSubscription.unsubscribe();
      this.dropEventTimerSubscription = null;
    }
    this.globalDragStartListener();
    this.globalDragEndListener();
    this.files = [];
    this.helperFormEl = null;
    this.fileInputPlaceholderEl = null;
  }

  public onDragOver(event: DragEvent): void {
    if (this.useDragEnter()) {
      this.preventAndStop(event);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    } else if (!this.isDropzoneDisabled() && !this.useDragEnter() && event.dataTransfer) {
      if (!this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = true;
        this.onFileOver.emit(event);
      }
      this.preventAndStop(event);
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  public onDragEnter(event: Event): void {
    if (!this.isDropzoneDisabled() && this.useDragEnter()) {
      if (!this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = true;
        this.onFileOver.emit(event);
      }
      this.preventAndStop(event);
    }
  }

  public onDragLeave(event: Event): void {
    if (!this.isDropzoneDisabled()) {
      if (this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = false;
        this.onFileLeave.emit(event);
      }
      this.preventAndStop(event);
    }
  }

  public dropFiles(event: DragEvent): void {
    if (this.isDropzoneDisabled()) {
      return;
    }
    this.isDraggingOverDropZone = false;
    if (event.dataTransfer) {
      let items: FileList | DataTransferItemList;
      if (event.dataTransfer.items) {
        items = event.dataTransfer.items;
      } else {
        items = event.dataTransfer.files;
      }
      this.preventAndStop(event);
      this.checkFiles(items);
    }
  }

  public openFileSelector = (event?: MouseEvent): void => {
    if (this.fileSelector && this.fileSelector.nativeElement) {
      (this.fileSelector.nativeElement as HTMLInputElement).click();
    }
  };

  public uploadFiles(event: Event): void {
    if (this.isDropzoneDisabled()) {
      return;
    }
    if (event.target) {
      const items = (event.target as HTMLInputElement).files;
      if (items) {
        this.checkFiles(items);
      }
      this.resetFileInput();
    }
  }

  private getFakeDropEntry(file: File): GnroFileDropEntry {
    const fakeFileEntry: FileSystemFileEntry = {
      name: file.name,
      isDirectory: false,
      isFile: true,
      file: <T>(callback: (filea: File) => T) => callback(file),
    };
    return new GnroFileDropEntry(fakeFileEntry.name, fakeFileEntry);
  }

  private checkFile(item: DataTransferItem | File): void {
    if ('webkitGetAsEntry' in item) {
      let entry = item.webkitGetAsEntry();
      if (entry) {
        if (entry.isFile) {
          const toUpload: GnroFileDropEntry = new GnroFileDropEntry(entry.name, entry);
          this.addToQueue(toUpload);
        } else if (entry.isDirectory) {
          this.traverseFileTree(entry, entry.name);
        }
        return;
      }
    }
    this.addToQueue(this.getFakeDropEntry(item as File));
  }

  private checkFiles(items: FileList | DataTransferItemList): void {
    for (let i = 0; i < items.length; i++) {
      this.checkFile(items[i]);
    }

    if (this.dropEventTimerSubscription) {
      this.dropEventTimerSubscription.unsubscribe();
    }
    this.dropEventTimerSubscription = timer(200, 200).subscribe(() => {
      if (this.files.length > 0 && this.numOfActiveReadEntries === 0) {
        const files = this.files;
        this.files = [];
        if (this.multiple()) {
          this.onFileDrop.emit(files);
        } else {
          this.onFileDrop.emit([files[0]]);
        }
      }
    });
  }

  private traverseFileTree(item: FileSystemEntry, path: string): void {
    if (item.isFile) {
      const toUpload: GnroFileDropEntry = new GnroFileDropEntry(path, item);
      this.files.push(toUpload);
    } else {
      path = path + '/';
      const dirReader = (item as FileSystemDirectoryEntry).createReader();
      let entries: FileSystemEntry[] = [];

      const readEntries = () => {
        this.numOfActiveReadEntries++;
        dirReader.readEntries((result) => {
          if (!result.length) {
            if (entries.length === 0) {
              const toUpload: GnroFileDropEntry = new GnroFileDropEntry(path, item);
              this.zone.run(() => {
                this.addToQueue(toUpload);
              });
            } else {
              for (let i = 0; i < entries.length; i++) {
                this.zone.run(() => {
                  this.traverseFileTree(entries[i], path + entries[i].name);
                });
              }
            }
          } else {
            entries = entries.concat(result);
            readEntries();
          }
          this.numOfActiveReadEntries--;
        });
      };

      readEntries();
    }
  }

  private resetFileInput(): void {
    if (this.fileSelector && this.fileSelector.nativeElement) {
      const fileInputEl = this.fileSelector.nativeElement as HTMLInputElement;
      const fileInputContainerEl = fileInputEl.parentElement;
      const helperFormEl = this.getHelperFormElement();
      const fileInputPlaceholderEl = this.getFileInputPlaceholderElement();

      if (fileInputContainerEl !== helperFormEl) {
        this.renderer.insertBefore(fileInputContainerEl, fileInputPlaceholderEl, fileInputEl);
        this.renderer.appendChild(helperFormEl, fileInputEl);
        helperFormEl.reset();
        this.renderer.insertBefore(fileInputContainerEl, fileInputEl, fileInputPlaceholderEl);
        this.renderer.removeChild(fileInputContainerEl, fileInputPlaceholderEl);
      }
    }
  }

  private getHelperFormElement(): HTMLFormElement {
    if (!this.helperFormEl) {
      this.helperFormEl = this.renderer.createElement('form') as HTMLFormElement;
    }

    return this.helperFormEl;
  }

  private getFileInputPlaceholderElement(): HTMLDivElement {
    if (!this.fileInputPlaceholderEl) {
      this.fileInputPlaceholderEl = this.renderer.createElement('div') as HTMLDivElement;
    }

    return this.fileInputPlaceholderEl;
  }

  private isDropzoneDisabled(): boolean {
    return this.globalDraggingInProgress || this.disabled();
  }

  private addToQueue(item: GnroFileDropEntry): void {
    this.files.push(item);
  }

  private preventAndStop(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
