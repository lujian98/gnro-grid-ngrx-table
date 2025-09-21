import { GnroDataType } from '@gnro/ui/core';
import { createActionGroup, props } from '@ngrx/store';

export const baseReducerManagerActions = createActionGroup({
  source: '[Base Reducer Manager]',
  events: {
    'Load Data': props<{ featureName: string }>(),
    'Load Data Success': props<{ data: GnroDataType[] }>(),
    'Reload Data': props<{ featureName: string }>(),
  },
});
