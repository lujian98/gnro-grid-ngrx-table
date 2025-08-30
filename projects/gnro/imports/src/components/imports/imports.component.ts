import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ElementRef } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutTopComponent,
  GnroLayoutVerticalComponent,
} from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroFileDropComponent, GnroFileDropEntry } from '@gnro/ui/file-upload';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroColumnConfig, GnroGridComponent, GnroGridData, GnroGridConfig } from '@gnro/ui/grid';
//import { CARSDATA3 } from './cars-large';

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
  private readonly elementRef = inject(ElementRef);
  params!: HttpParams;

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
          console.log(' drop file fiele=', file);
          //this.fileUploadFacade.dropUploadFile(droppedFile.relativePath, file);
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
