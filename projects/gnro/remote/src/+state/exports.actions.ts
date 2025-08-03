import { HttpParams } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const openRemoteExportsWindowAction = createAction(
  '[Remote Exports] Open Remote Exports Window',
  props<{ params: HttpParams }>(),
);

export const startRemoteExportsAction = createAction(
  '[Remote Exports] Start Remote Exports',
  props<{ params: HttpParams }>(),
);

export const closeRemoteExportsWindowAction = createAction('[Remote Exports] Close Remote Exports Window');

export const remoteExportFileSuccessAction = createAction('[Remote Exports] Remote Exports File Success');
