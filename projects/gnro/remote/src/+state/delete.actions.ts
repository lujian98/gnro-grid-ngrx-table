import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { GrnoDataType } from '@gnro/ui/core';

export const remoteDeleteActions = createActionGroup({
  source: '[Remote Delete]',
  events: {
    'Open Confirmation Window': props<{ stateId: string; keyName: string; selected: GrnoDataType[] }>(),
    'Close Confirmation Window': emptyProps(),
    'Delete Selected': props<{ stateId: string; keyName: string; selected: GrnoDataType[] }>(),
    'Delete Selected Success': props<{ stateId: string; keyName: string }>(),
  },
});
