import { HttpParams } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const openRemoteImportsWindowAction = createAction(
  '[Remote Imports] Open Remote Imports Window',
  props<{ stateId: string; keyName: string; params: HttpParams }>(),
);

export const startRemoteImportsAction = createAction(
  '[Remote Imports] Start Remote Imports',
  props<{ params: HttpParams }>(),
);

export const closeRemoteImportsWindowAction = createAction('[Remote Imports] Close Remote Imports Window');

//xport const remoteExportFileSuccessAction = createAction('[Remote Imports] Remote Imports File Success');
