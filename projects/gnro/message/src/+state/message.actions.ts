import { createAction, props } from '@ngrx/store';

export const openToastMessageAction = createAction(
  '[Message] Open Toast Message',
  props<{ action: string; keyName: string; configType: string }>(),
);

export const sendToastMessageAction = createAction('[Message] Send Toast Message');
