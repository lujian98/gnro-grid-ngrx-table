import { GnroDataType } from '@gnro/ui/core';
import { createActionGroup, props } from '@ngrx/store';
import { BaseReducerManagerConfig } from '../config.model';

export const baseReducerManagerActions = createActionGroup({
  source: 'Base Reducer Manager',
  events: {
    'Load Config': props<{ featureName: string; config: BaseReducerManagerConfig }>(),
    'Load Data': props<{ featureName: string }>(),
    'Load Data Success': props<{ featureName: string; data: GnroDataType[] }>(),
    'Reload Data': props<{ featureName: string }>(),
  },
});
