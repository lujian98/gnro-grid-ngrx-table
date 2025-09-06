import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroObjectType, GrnoDataType } from '@gnro/ui/core';
import { GnroFileDropComponent, GnroFileDropEntry, getFileUpload } from '@gnro/ui/file-upload';
import { GnroGridCellRendererComponent, GnroGridComponent, GnroGridConfig, GnroGridFacade } from '@gnro/ui/grid';
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
  selector: 'gnro-imports-status',
  template: `{{ data }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': '"100%"',
    '[style.color]': 'textColor()',
  },
})
export class ImportsStatusComponent extends GnroGridCellRendererComponent<string> {
  textColor = computed(() => (this.data !== 'add' && this.data !== 'update' ? 'red' : 'green'));
}

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
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly importsFacade = inject(GnroImportsFacade);
  urlKey!: string;
  gridId$ = signal<string>('');

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
  columnsConfig = computed(() => {
    const config = [...this.importsFacade.getSelectColumnsConfig$()];
    config.push({
      name: 'ImportStatus',
      align: 'center',
      width: 30,
      rendererType: GnroObjectType.Component,
      component: ImportsStatusComponent,
    });
    return config;
  });

  importDisabled = computed(() => {
    const data = this.gridData().data;
    if (data.length > 0) {
      return (
        data.filter((item: GrnoDataType) => {
          const status = item['ImportStatus'];
          return status !== 'add' && status !== 'update';
        }).length !== 0
      );
    }
    return true;
  });
  deleteDisabled = computed(() => !(this.gridFacade.getRowSelection(this.gridId$())()?.selected! > 0));
  resetDisabled = computed(() => !(this.gridData()?.totalCounts! > 0));

  gnroGridId(gridId: string): void {
    this.gridId$.set(gridId);
  }

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
    this.importsFacade.saveRecords(this.urlKey);
  }

  delete(): void {
    const selected = this.gridFacade.getRowSelection(this.gridId$())()?.selection.selected! as GrnoDataType[];
    this.importsFacade.deleteSelectedRecords(selected);
    this.gridFacade.setSelectAllRows(this.gridId$(), false);
  }

  reset(): void {
    this.importsFacade.resetRecords();
  }

  close(): void {
    this.importsFacade.resetRecords();
    //this.gridFacade.refresh(this.importsFacade.getSelectStateId$()); //not working and no need??
    this.dialogRef.close();
  }
}
