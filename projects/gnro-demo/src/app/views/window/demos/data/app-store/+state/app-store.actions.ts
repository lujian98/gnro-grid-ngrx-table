import { GrnoDataType } from '@gnro/ui/core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { appBaseStoreActions } from '../../base-store';

const newActions = createActionGroup({
  source: '[Base Store]', // source can be difference from [Base Store]
  events: {
    'Refresh Data': emptyProps(),
    'Refresh Data Success': props<{ data: GrnoDataType[] }>(),
  },
});

export const appStoreActions = {
  ...appBaseStoreActions,
  ...newActions,
};
