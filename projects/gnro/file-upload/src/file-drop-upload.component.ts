import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { GnroCheckboxComponent } from '@gnro/ui/checkbox';
import { GnroBUTTONS, GnroButtonConfg, GnroButtonType } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroFileUploadStateModule } from './+state/file-upload-state.module';
import { GnroFileUploadFacade } from './+state/file-upload.facade';
import { GnroFileDropEntry } from './components/file-drop/file-drop-entry';
import { GnroFileDropComponent } from './components/file-drop/file-drop.component';
import { GnroFileUploadGridComponent } from './components/file-upload-grid/file-upload-grid.component';
import { GnroFileUploadConfig, defaultFileUploadConfig } from './models/file-upload.model';

@Component({
  selector: 'gnro-file-drop-upload',
  templateUrl: './file-drop-upload.component.html',
  styleUrls: ['./file-drop-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    GnroFileUploadStateModule,
    GnroIconModule,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroFileDropComponent,
    GnroFileUploadGridComponent,
    GnroCheckboxComponent,
  ],
})
export class GnroFileDropUploadComponent implements OnDestroy {
  private readonly fileUploadFacade = inject(GnroFileUploadFacade);
  private buttons: GnroButtonConfg[] = [GnroBUTTONS.UploadFile, GnroBUTTONS.Reset];
  uploadFiles$ = this.fileUploadFacade.getUploadFiles$;
  enabled = signal<boolean>(true);
  fileUploadConfig = input(defaultFileUploadConfig, {
    transform: (val: Partial<GnroFileUploadConfig>) => ({ ...defaultFileUploadConfig, ...val }),
  });
  buttons$ = computed(() => {
    const disabled = this.uploadFiles$().length === 0 ? true : false;
    return [...this.buttons].map((button) => {
      return {
        ...button,
        disabled: disabled,
      };
    });
  });

  get className(): string {
    return !this.enabled() ? 'gnro-file-drop__drop-zone--disabled' : 'gnro-file-drop__drop-zone--enabled';
  }

  dropped(files: GnroFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.fileUploadFacade.dropUploadFile(droppedFile.relativePath, file);
        });
      }
    }
  }

  onChange(enabled: boolean): void {
    if (typeof enabled === 'boolean') {
      this.enabled.set(enabled);
    }
  }

  buttonClick(button: GnroButtonConfg): void {
    switch (button.name) {
      case GnroButtonType.Reset:
        this.fileUploadFacade.clearUploadFiles();
        break;
      case GnroButtonType.UploadFile:
        this.fileUploadFacade.uploadFiles(this.fileUploadConfig());
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.fileUploadFacade.clearUploadFiles();
  }
}
