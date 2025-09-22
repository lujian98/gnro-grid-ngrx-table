import { HttpParams } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const remoteExportsActions = createActionGroup({
  source: 'Remote Exports',
  events: {
    Open: props<{ params: HttpParams }>(),
    Start: props<{ params: HttpParams }>(),
    Close: emptyProps(),
    Success: emptyProps(),
  },
});
