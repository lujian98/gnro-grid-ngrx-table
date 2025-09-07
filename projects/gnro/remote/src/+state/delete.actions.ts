import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const remoteDeleteActions = createActionGroup({
  source: '[Remote Delete]',
  events: {
    'Open Confirmation Window': props<{ stateId: string; keyName: string; selected: unknown[] }>(),
    'Close Confirmation Window': emptyProps(),
    'Delete Selected': props<{ stateId: string; keyName: string; selected: unknown[] }>(),
    'Delete Selected Success': props<{ stateId: string; keyName: string }>(),
  },
});
