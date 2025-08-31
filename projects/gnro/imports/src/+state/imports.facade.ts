import { inject, Injectable } from '@angular/core';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { GnroGridFacade } from '@gnro/ui/grid';
import { Store } from '@ngrx/store';
import { importsFileAction, openRemoteImportsWindowAction } from './imports.actions';
import { selectImportedExcelData, selectStateId } from './imports.selectors';

@Injectable({ providedIn: 'root' })
export class GnroImportsFacade {
  private readonly store = inject(Store);
  private readonly backendService = inject(GnroBackendService);
  private readonly gridFacade = inject(GnroGridFacade);

  getSelectStateId$ = this.store.selectSignal(selectStateId);
  getSelectImportedExcelData$ = this.store.selectSignal(selectImportedExcelData);

  imports(gridId: string): void {
    const gridConfig = this.gridFacade.getGridConfig(gridId)();
    console.log(' gridConfig=', gridConfig);
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, keyName: gridConfig.urlKey }));
  }

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): void {
    this.store.dispatch(importsFileAction({ importsFileConfig, file }));
  }

  clearUploadFiles(): void {
    //this.store.dispatch(fileUploadActions.clearUploadFiles());
  }
}
