import { createAction, props } from '@ngrx/store';

export const updateToastMessageAction = createAction(
  '[Message] Update Toast Message',
  props<{ action: string; keyName: string; configType: string }>(),
);

export const sendToastMessageAction = createAction('[Message] Send Toast Message');
