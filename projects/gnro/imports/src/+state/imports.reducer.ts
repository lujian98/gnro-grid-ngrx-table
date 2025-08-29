import { createFeature, createReducer, on } from '@ngrx/store';
import { openRemoteImportsWindowAction } from './imports.actions';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
}

export const initialState: ImportsState = {
  stateId: '',
};

export const gnroImportsFeature = createFeature({
  name: 'gnroImports',
  reducer: createReducer(
    initialState,
    on(openRemoteImportsWindowAction, (state, action) => {
      return {
        ...state,
        stateId: action.stateId,
      };
    }),
  ),
});
