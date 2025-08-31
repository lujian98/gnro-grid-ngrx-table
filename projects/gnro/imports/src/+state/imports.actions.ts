import { HttpParams } from '@angular/common/http';
import { GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';
import { createAction, props } from '@ngrx/store';

export const openRemoteImportsWindowAction = createAction(
  '[Remote Imports] Open Remote Imports Window',
  props<{ stateId: string; keyName: string }>(),
);

export const startRemoteImportsAction = createAction(
  '[Remote Imports] Start Remote Imports',
  props<{ params: HttpParams }>(),
);

export const closeRemoteImportsWindowAction = createAction('[Remote Imports] Close Remote Imports Window');

export const importsFileAction = createAction(
  '[Remote Imports] Imports File',
  props<{ importsFileConfig: GnroFileUploadConfig; file: GnroUploadFile }>(),
);

export const importsFileSuccessAction = createAction(
  '[Remote Imports] Imports File Success',
  props<{ importedExcelData: GnroGridData<object>; columnsConfig: GnroColumnConfig[] }>(),
);

export const resetImportsDataAction = createAction('[Remote Imports] Reset Remote Imports Data');

export const deleteImportsSelectedAction = createAction(
  '[Remote Imports] Delete Imports Selected Records',
  props<{ selected: object[] }>(),
);
