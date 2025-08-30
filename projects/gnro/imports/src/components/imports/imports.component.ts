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
import { GnroImportsFacade } from '../../+state/imports.facade';

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
  private dialogRef = inject(GnroDialogRef<GnroImportsComponent>);
  private readonly importsFacade = inject(GnroImportsFacade);
  urlKey!: string;

  windowConfig = {
    ...defaultWindowConfig,
    title: 'GNRO.UI.ACTIONS.IMPORT',
    width: `${window.innerWidth - 150}px`,
    height: `${window.innerHeight - 150}px`,
  };

  gridConfig: Partial<GnroGridConfig> = {
    //...defaultGridConfig,
    urlKey: 'Imports',
    verticalScroll: true,
    hideFooterPage: true,
    pageSize: 100000,
    rowSelection: true,
    multiRowSelection: true,
    hideTopbar: true,
    columnSort: true,
    columnResize: true,
    //columnReorder: true,
    //columnMenu: true,
    //columnHidden: true,
  };

  importsFileConfig = computed(() => ({
    urlKey: this.urlKey,
    fileDir: 'upload',
    maxSelectUploads: 1,
  }));

  gridData = computed(() => this.importsFacade.getSelectImportedExcelData$());

  //TODO use remote columns config???
  columnsConfig = computed(() => {
    const gridData = this.importsFacade.getSelectImportedExcelData$();
    if (gridData && gridData.totalCounts > 0) {
      return Object.keys(gridData.data[0]).map((key) => ({ name: key }));
    } else {
      return [];
    }
  });

  dropped(files: GnroFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          //console.log(' drop file fiele=', file); // file: File, relativePath:
          const importsFile = getFileUpload('imports', file, droppedFile.relativePath);
          //console.log('this.importsFileConfig= ', this.importsFileConfig());
          //console.log('importsFile= ', importsFile);
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
