import { GnroUploadFile, GrnoDataType } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { createAction, props } from '@ngrx/store';
import { GnroImportsResponse } from '../models/imports.model';

export const openRemoteImportsWindowAction = createAction(
  '[Remote Imports] Open Remote Imports Window',
  props<{ stateId: string; urlKey: string }>(),
);

export const closeRemoteImportsWindowAction = createAction('[Remote Imports] Close Remote Imports Window');

export const importsFileAction = createAction(
  '[Remote Imports] Imports File',
  props<{ importsFileConfig: GnroFileUploadConfig; file: GnroUploadFile }>(),
);

export const importsFileSuccessAction = createAction(
  '[Remote Imports] Imports File Success',
  props<{ importsResponse: GnroImportsResponse }>(),
);

export const resetImportsDataAction = createAction('[Remote Imports] Reset Remote Imports Data');

export const deleteImportsSelectedAction = createAction(
  '[Remote Imports] Delete Imports Selected Records',
  props<{ selected: GrnoDataType[] }>(),
);

export const saveImportsRecordsAction = createAction(
  '[Remote Imports] Save Imports Records',
  props<{ urlKey: string; records: GrnoDataType[] }>(),
);

export const saveImportsRecordsSuccessAction = createAction(
  '[Remote Imports] Save Imports Records Success',
  props<{ urlKey: string }>(),
);
