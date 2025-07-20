import { createAction, props } from '@ngrx/store';
import { GnroFormWindowConfig } from '../models/form-window.model';

export const openFormWindowDialogAction = createAction(
  '[Form Window] Open Form Window Dialog',
  props<{ stateId: string; formWindowConfig: GnroFormWindowConfig }>(),
);

export const closeFormWindowDialogAction = createAction('[Form Window] Close Form Window Dialog');

export const applyFormWindowDialogChangesAction = createAction(
  '[Form Window] Apply Form Window Dialog Changes',
  props<{ values: object }>(),
);

export const savedFormWindowDataAction = createAction(
  '[Form Window] Remote Saved Form Window Data',
  props<{ stateId: string; keyName: string }>(),
);
