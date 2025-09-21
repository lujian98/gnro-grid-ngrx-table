import { GnroDataType, GnroOnAction } from '@gnro/ui/core';
import { createReducer, on } from '@ngrx/store';
import { baseReducerManagerActions } from './base-reducer-manager.actions';
import { BaseReducerManagerConfig } from '../config.model';

export interface BaseReducerManagerState {
  featureName: string;
  config: BaseReducerManagerConfig;
  data: GnroDataType[];
}

export const initialState: BaseReducerManagerState = {
  featureName: '',
  config: {
    pageSize: 25,
  },
  data: [],
};

export const baseReducerManagerOnActions: GnroOnAction<BaseReducerManagerState>[] = [
  on(baseReducerManagerActions.loadConfig, (state, action) => {
    const featureName = state.featureName === '' ? action.featureName : state.featureName;
    const config = featureName === action.featureName ? action.config : state.config;
    return {
      ...state,
      featureName,
      config,
    };
  }),

  on(baseReducerManagerActions.loadDataSuccess, (state, action) => {
    const data = state.featureName === action.featureName ? action.data : state.data;
    return {
      ...state,
      data,
    };
  }),
];

export const baseReducerManagerReducer = createReducer(initialState, ...baseReducerManagerOnActions);
