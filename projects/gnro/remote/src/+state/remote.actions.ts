import { GnroButtonConfg } from '@gnro/ui/core';
import { createAction, props } from '@ngrx/store';

export const openDeleteConfirmationAction = createAction(
  '[Remote Button] Open Delete Confirmation Window',
  props<{ stateId: string; keyName: string; selected: unknown[] }>(),
);

export const closeDeleteConfirmationAction = createAction('[Remote Button] close Delete Confirmation Window');

export const applyDeleteConfirmationAction = createAction(
  '[Remote Button] Apply Delete Confirmation Action',
  props<{ stateId: string; keyName: string; selected: unknown[] }>(),
);

export const deleteSelectedSucessfulAction = createAction(
  '[Remote Button] Delete Selected Sucessful Action',
  props<{ stateId: string; keyName: string }>(),
);

export const buttonRemoteAction = createAction(
  '[Remote Button] Remote Button Action',
  props<{ button: GnroButtonConfg; keyName: string; configType: string; formData: object }>(),
);
