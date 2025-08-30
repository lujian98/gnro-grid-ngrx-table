import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ElementRef, computed } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutTopComponent,
  GnroLayoutVerticalComponent,
} from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroFileDropComponent, GnroFileDropEntry, GnroFileUploadConfig, getFileUpload } from '@gnro/ui/file-upload';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroColumnConfig, GnroGridComponent, GnroGridData, GnroGridConfig } from '@gnro/ui/grid';
import { GnroImportsFacade } from '../../+state/imports.facade';
//import { CARSDATA3 } from './cars-large';

/*
export interface GnroFileUploadConfig {
  urlKey: string;
  fileDir: string; // default to urlKey if not defined
  maxSelectUploads: number; // for file select upload only
}

export const defaultFileUploadConfig: GnroFileUploadConfig = {
  urlKey: 'upload',
  fileDir: 'upload',
  maxSelectUploads: 5,
};

*/
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
  private readonly elementRef = inject(ElementRef);
  urlKey!: string;

  windowConfig = {
    ...defaultWindowConfig,
    title: 'GNRO.UI.ACTIONS.IMPORT',
    width: `${window.innerWidth - 150}px`,
    height: `${window.innerHeight - 150}px`,
  };

  importsFileConfig = computed(() => ({
    urlKey: this.urlKey,
    fileDir: 'upload',
    maxSelectUploads: 1,
  }));

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

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
    },
    {
      name: 'vin',
      title: 'Vin#',
    },
    {
      name: 'brand',
    },
    {
      name: 'year',
      width: 50,
      align: 'right',
    },
    {
      name: 'color',
      width: 80,
      align: 'center',
    },
  ];
  //gridData: GnroGridData<any> = CARSDATA3;

  dropped(files: GnroFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(' drop file fiele=', file); // file: File, relativePath:
          const importsFile = getFileUpload('imports', file, droppedFile.relativePath);
          console.log('this.importsFileConfig= ', this.importsFileConfig());
          console.log('importsFile= ', importsFile);
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
