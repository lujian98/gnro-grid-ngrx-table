import { createFeature, createReducer, on } from '@ngrx/store';
import * as formWindowActions from './form-window.actions';

export interface FormWindowState {
  formWindowId: string;
}

export const initialState: FormWindowState = {
  formWindowId: '',
};

export const gnroFormWindowFeature = createFeature({
  name: 'gnroFormWindow',
  reducer: createReducer(
    initialState,
    on(formWindowActions.openFormWindowDialog, (state, action) => {
      return {
        ...state,
        formWindowId: action.formWindowId,
      };
    }),
  ),
});
