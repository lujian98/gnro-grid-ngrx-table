import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { GnroDataType } from '@gnro/ui/core';

export const remoteDeleteActions = createActionGroup({
  source: '[Remote Delete]',
  events: {
    'Open Confirmation Window': props<{ stateId: string; keyName: string; selected: GnroDataType[] }>(),
    'Close Confirmation Window': emptyProps(),
    'Delete Selected': props<{ stateId: string; keyName: string; selected: GnroDataType[] }>(),
    'Delete Selected Success': props<{ stateId: string; keyName: string }>(),
  },
});
