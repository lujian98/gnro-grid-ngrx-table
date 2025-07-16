import { createAction, props } from '@ngrx/store';

export const updateToastMessageAction = createAction(
  '[Message] Update Toast Message',
  props<{ keyName: string; configType: string }>(),
);

export const sendToastMessageAction = createAction('[Message] Send Toast Message');
