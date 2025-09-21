import { GnroDataType, GnroOnAction } from '@gnro/ui/core';
import { createReducer, on } from '@ngrx/store';
import { baseReducerManagerActions } from './base-reducer-manager.actions';
import { BaseReducerManagerConfig } from '../config.model';

export interface BaseReducerManagerState {
  config: BaseReducerManagerConfig;
  data: GnroDataType[];
}

export const initialState: BaseReducerManagerState = {
  config: {
    pageSize: 25,
  },
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
