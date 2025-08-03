import { createAction, props } from '@ngrx/store';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export const openRemoteExportsWindowAction = createAction(
  '[Remote Exports] Open Exports Window',
  props<{ params: HttpParams }>(),
);

export const remoteExportFileSuccessAction = createAction('[Remote Exports] Remote Exports File Success');
