import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroFileDropComponent, GnroFileDropEntry, getFileUpload } from '@gnro/ui/file-upload';
import { GnroGridComponent, GnroGridConfig, GnroGridFacade, GnroGridStateModule } from '@gnro/ui/grid';
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
    GnroGridStateModule,
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
  columnsConfig = computed(() => this.importsFacade.getSelectColumnsConfig$());
  //TODO list data has invalid record
  importDisabled = computed(() => {
    return !(this.gridData()?.totalCounts! > 0);
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
    //this.dialogRef.close(params);
  }

  delete(): void {
    //this.dialogRef.close(params);
  }

  reset(): void {
    this.importsFacade.resetImportsData();
  }

  close(): void {
    this.dialogRef.close();
  }
}
