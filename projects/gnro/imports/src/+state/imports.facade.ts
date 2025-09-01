import { inject, Injectable } from '@angular/core';
import { GnroUploadFile, GrnoDataType } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { Store } from '@ngrx/store';
import {
  deleteImportsSelectedAction,
  importsFileAction,
  openRemoteImportsWindowAction,
  resetImportsDataAction,
  saveImportsRecordsAction,
} from './imports.actions';
import { selectColumnsConfig, selectImportedExcelData, selectStateId } from './imports.selectors';

@Injectable({ providedIn: 'root' })
export class GnroImportsFacade {
  private readonly store = inject(Store);

  getSelectStateId$ = this.store.selectSignal(selectStateId);
  getSelectImportedExcelData$ = this.store.selectSignal(selectImportedExcelData);
  getSelectColumnsConfig$ = this.store.selectSignal(selectColumnsConfig);

  imports(gridId: string, urlKey: string): void {
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, urlKey }));
  }

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): void {
    this.store.dispatch(importsFileAction({ importsFileConfig, file }));
  }

  resetImportsData(): void {
    this.store.dispatch(resetImportsDataAction());
  }

  deleteImportsSelected(selected: GrnoDataType[]): void {
    this.store.dispatch(deleteImportsSelectedAction({ selected }));
  }

  saveImportsRecordsAction(urlKey: string): void {
    const records = this.getSelectImportedExcelData$().data;
    this.store.dispatch(saveImportsRecordsAction({ urlKey, records }));
  }
}
