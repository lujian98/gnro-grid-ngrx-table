import { GnroDataType } from '@gnro/ui/core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const baseReducerManagerActions = createActionGroup({
  source: '[Base Reducer Manager]',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{ data: GnroDataType[] }>(),
    'Reload Data': emptyProps(),
  },
});
