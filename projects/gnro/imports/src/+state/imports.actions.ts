import { HttpParams } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { GnroFileUploadConfig, GnroFileUpload } from '@gnro/ui/file-upload';

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
  props<{ importsFileConfig: GnroFileUploadConfig; file: GnroFileUpload }>(),
);

export const importsFileSuccessAction = createAction('[Remote Imports] Imports File Success');
