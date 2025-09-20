import { GnroDataType, GnroOnAction } from '@gnro/ui/core';
import { createReducer, on } from '@ngrx/store';
import { baseReducerManagerActions } from './base-reducer-manager.actions';

export interface BaseReducerManagerState {
  data: GnroDataType[];
}

export const initialState: BaseReducerManagerState = {
  data: [],
};

export const baseReducerManagerOnActions: GnroOnAction<BaseReducerManagerState>[] = [
  on(baseReducerManagerActions.loadDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
    };
  }),
];

export const baseReducerManagerReducer = createReducer(initialState, ...baseReducerManagerOnActions);
