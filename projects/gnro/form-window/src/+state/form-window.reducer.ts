import { createFeature, createReducer, on } from '@ngrx/store';
import * as formWindowActions from './form-window.actions';

//only support one open dialog window at a time
export interface FormWindowState {
  stateId: string;
}

export const initialState: FormWindowState = {
  stateId: '',
};

export const gnroFormWindowFeature = createFeature({
  name: 'gnroFormWindow',
  reducer: createReducer(
    initialState,
    on(formWindowActions.openFormWindowDialog, (state, action) => {
      return {
        ...state,
        stateId: action.stateId,
      };
    }),
  ),
});
