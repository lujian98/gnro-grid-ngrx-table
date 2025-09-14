import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GrnoDataType } from '@gnro/ui/core';

export const appStoreActions = createActionGroup({
  source: '[App Store]',
  events: {
    //'Load Data': emptyProps(),
    //'Load Data Success': props<{ data: GrnoDataType[] }>(),
  },
});
