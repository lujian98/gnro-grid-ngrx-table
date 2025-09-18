import { inject, Injectable } from '@angular/core';
import { GnroUploadFile, GnroDataType } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { Store } from '@ngrx/store';
import { importsActions } from './imports.actions';
import { selectColumnsConfig, selectImportedExcelData, selectStateId } from './imports.selectors';

@Injectable({ providedIn: 'root' })
export class GnroImportsFacade {
  private readonly store = inject(Store);

  getSelectStateId$ = this.store.selectSignal(selectStateId);
  getSelectImportedExcelData$ = this.store.selectSignal(selectImportedExcelData);
  getSelectColumnsConfig$ = this.store.selectSignal(selectColumnsConfig);

  imports(gridId: string, urlKey: string): void {
    this.store.dispatch(importsActions.openWindow({ stateId: gridId, urlKey }));
  }

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): void {
    this.store.dispatch(importsActions.importsFile({ importsFileConfig, file }));
  }

  resetRecords(): void {
    this.store.dispatch(importsActions.resetRecords());
  }

  deleteSelectedRecords(selected: GnroDataType[]): void {
    this.store.dispatch(importsActions.deleteSelectedRecords({ selected }));
  }

  saveRecords(urlKey: string): void {
    const records = this.getSelectImportedExcelData$().data;
    this.store.dispatch(importsActions.saveRecords({ urlKey, records }));
  }
}
