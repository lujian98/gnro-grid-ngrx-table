import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroFileDropComponent, GnroFileDropEntry, getFileUpload } from '@gnro/ui/file-upload';
import { GnroGridComponent, GnroGridConfig } from '@gnro/ui/grid';
import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutTopComponent,
  GnroLayoutVerticalComponent,
} from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroImportsFacade } from './+state/imports.facade';

@Component({
  selector: 'gnro-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroLayoutVerticalComponent,
    GnroLayoutTopComponent,
    GnroButtonComponent,
    GnroWindowComponent,
    GnroGridComponent,
    GnroFileDropComponent,
  ],
})
export class GnroImportsComponent {
  private readonly dialogRef = inject(GnroDialogRef<GnroImportsComponent>);
  private readonly importsFacade = inject(GnroImportsFacade);
  urlKey!: string;

  windowConfig = {
    ...defaultWindowConfig,
    title: 'GNRO.UI.ACTIONS.IMPORT',
    width: `${window.innerWidth - 150}px`,
    height: `${window.innerHeight - 150}px`,
  };

  gridConfig: Partial<GnroGridConfig> = {
    urlKey: 'Imports',
    verticalScroll: true,
    hideFooterPage: true,
    pageSize: 100000,
    rowSelection: true,
    multiRowSelection: true,
    hideTopbar: true,
    columnSort: true,
    columnResize: true,
  };

  importsFileConfig = computed(() => ({ urlKey: this.urlKey, fileDir: 'upload', maxSelectUploads: 1 }));
  gridData = computed(() => this.importsFacade.getSelectImportedExcelData$());
  columnsConfig = computed(() => this.importsFacade.getSelectColumnsConfig$());

  dropped(files: GnroFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const importsFile = getFileUpload('imports', file, droppedFile.relativePath);
          this.importsFacade.importsFile(this.importsFileConfig(), importsFile);
        });
      }
    }
  }

  import(): void {
    //this.dialogRef.close(params);
  }

  close(): void {
    this.dialogRef.close();
  }
}
