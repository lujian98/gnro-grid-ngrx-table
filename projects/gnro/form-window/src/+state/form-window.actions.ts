import { createAction, props } from '@ngrx/store';
import { GnroFormWindowConfig } from '../models/form-window.model';

export const openFormWindowDialog = createAction(
  '[Form Window] Open Form Window Dialog',
  props<{ formWindowId: string; formWindowConfig: GnroFormWindowConfig }>(),
);

export const closeFormWindowDialog = createAction('[Form Window] Close Form Window Dialog');

export const applyFormWindowDialogChanges = createAction(
  '[Form Window] Apply Form Window Dialog Changes',
  props<{ values: object }>(),
);

export const savedFormWindowData = createAction(
  '[Form Window] Saved Form Window Data',
  props<{ formWindowId: string; formData: object }>(),
);

export const applyBuildPage = createAction(
  '[Form Window] Apply Build Page',
  props<{
    keyName: string;
    configType: string;
    configData: object;
  }>(),
);
