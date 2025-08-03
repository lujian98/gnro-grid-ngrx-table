import { createAction, props } from '@ngrx/store';

export const openDeleteConfirmationAction = createAction(
  '[Remote Delete] Open Delete Confirmation Window',
  props<{ stateId: string; keyName: string; selected: unknown[] }>(),
);

export const closeDeleteConfirmationAction = createAction('[Remote Button] close Delete Confirmation Window');

export const applyDeleteConfirmationAction = createAction(
  '[Remote Delete] Apply Delete Confirmation Action',
  props<{ stateId: string; keyName: string; selected: unknown[] }>(),
);

export const deleteSelectedSucessfulAction = createAction(
  '[Remote Delete] Delete Selected Sucessful Action',
  props<{ stateId: string; keyName: string }>(),
);
