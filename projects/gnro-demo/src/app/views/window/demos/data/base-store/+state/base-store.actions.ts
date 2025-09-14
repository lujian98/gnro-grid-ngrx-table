import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GrnoDataType } from '@gnro/ui/core';

export const appBaseStoreActions = createActionGroup({
  source: '[Base Store]',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{ data: GrnoDataType[] }>(),
  },
});
