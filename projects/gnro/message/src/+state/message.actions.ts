import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GnroMessageActions = createActionGroup({
  source: '[Message] Toast Message',
  events: {
    'Show Toast': props<{ action: string; keyName: string; configType: string }>(),
    'Hide Toast': emptyProps(),
  },
});

/*
export const openToastMessageAction = createAction(
  '[Message] Open Toast Message',
  props<{ action: string; keyName: string; configType: string }>(),
);

export const sendToastMessageAction = createAction('[Message] Send Toast Message');

*/
