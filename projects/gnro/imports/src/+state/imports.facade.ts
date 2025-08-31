import { inject, Injectable } from '@angular/core';
import { GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { GnroGridFacade } from '@gnro/ui/grid';
import { Store } from '@ngrx/store';
import {
  importsFileAction,
  openRemoteImportsWindowAction,
  resetImportsDataAction,
  deleteImportsSelectedAction,
  saveImportsRecordsAction,
} from './imports.actions';
import { selectColumnsConfig, selectImportedExcelData, selectStateId } from './imports.selectors';

@Injectable({ providedIn: 'root' })
export class GnroImportsFacade {
  private readonly store = inject(Store);
  private readonly gridFacade = inject(GnroGridFacade);

  getSelectStateId$ = this.store.selectSignal(selectStateId);
  getSelectImportedExcelData$ = this.store.selectSignal(selectImportedExcelData);
  getSelectColumnsConfig$ = this.store.selectSignal(selectColumnsConfig);

  imports(gridId: string): void {
    const gridConfig = this.gridFacade.getGridConfig(gridId)();
    this.resetImportsData();
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, keyName: gridConfig.urlKey }));
  }

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): void {
    this.store.dispatch(importsFileAction({ importsFileConfig, file }));
  }

  resetImportsData(): void {
    this.store.dispatch(resetImportsDataAction());
  }

  deleteImportsSelected(selected: object[]): void {
    this.store.dispatch(deleteImportsSelectedAction({ selected }));
  }

  saveImportsRecordsAction(urlKey: string): void {
    const records = this.getSelectImportedExcelData$().data;
    this.store.dispatch(saveImportsRecordsAction({ urlKey, records }));
  }

  //clearUploadFiles(): void {
  //this.store.dispatch(fileUploadActions.clearUploadFiles());
  //}
}
