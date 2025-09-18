import { GnroOnAction } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import { formWindowActions } from './form-window.actions';

//only support one open dialog window at a time
export interface FormWindowState {
  stateId: string;
}

export const initialState: FormWindowState = {
  stateId: '',
};

export const gnroFormWindowOnActions: GnroOnAction<FormWindowState>[] = [
  on(formWindowActions.open, (state, action) => {
    return {
      ...state,
      stateId: action.stateId,
    };
  }),
];

export const gnroFormWindowReducer = createReducer(initialState, ...gnroFormWindowOnActions);
export const gnroFormWindowFeature = createFeature({ name: 'gnroFormWindow', reducer: gnroFormWindowReducer });
