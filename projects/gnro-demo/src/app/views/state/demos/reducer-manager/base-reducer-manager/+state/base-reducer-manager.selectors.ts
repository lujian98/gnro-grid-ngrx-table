import { createSelector } from '@ngrx/store';
import { BaseReducerManagerState } from './base-reducer-manager.reducer';

export interface AppBaseReducerManagerState {
  [key: string]: BaseReducerManagerState;
}

export const selectData = (featureName: string) =>
  createSelector(
    (state: AppBaseReducerManagerState) => {
      console.log(' aaaaa featureName=', featureName);
      console.log(' state=', state);
      return state[featureName];
    },
    (state: BaseReducerManagerState) => state.data,
  );
