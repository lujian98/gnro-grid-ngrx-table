import { GnroButtonConfg } from '@gnro/ui/core';
import { createAction, props } from '@ngrx/store';

export const buttonRemoteAction = createAction(
  '[Remote Button] Remote Button Action',
  props<{ button: GnroButtonConfg; keyName: string; configType: string; formData: object }>(),
);
