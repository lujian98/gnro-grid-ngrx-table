import { createFeature, createReducer, on } from '@ngrx/store';
import { DashboardState, defaultDashboardState } from '../models/dashboard.model';
import { viewportConfig, viewportSetting } from '../utils/viewport-setting';
import { dashboardActions } from './dashboard.actions';

const initialState = <T>(): DashboardState<T> => ({});

export const gnroDashboardFeature = createFeature({
  name: 'gnroDashboard',
  reducer: createReducer(
    initialState(),
    on(dashboardActions.initConfig, (state, action) => {
      const dashboardConfig = { ...action.dashboardConfig };
      const key = action.dashboardId;
      const newState = { ...state };
      const setting = {
        ...defaultDashboardState().dashboardSetting,
        dashboardId: action.dashboardId,
        viewportReady: !dashboardConfig.remoteConfig,
      };
      newState[key] = {
        ...defaultDashboardState(),
        dashboardConfig,
        dashboardSetting: viewportSetting(dashboardConfig, setting),
      };
      return { ...newState };
    }),
    on(dashboardActions.loadConfigSuccess, (state, action) => {
      const dashboardConfig = { ...action.dashboardConfig };
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        const setting = {
          ...state[key].dashboardSetting,
          viewportReady: true,
        };
        newState[key] = {
          ...state[key],
          dashboardConfig,
          dashboardSetting: viewportSetting(dashboardConfig, setting),
        };
      }
      return { ...newState };
    }),
    on(dashboardActions.loadOptions, (state, action) => {
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          dashboardSetting: {
            ...state[key].dashboardSetting,
            viewportReady: true,
          },
          options: [...action.options],
        };
      }
      return { ...newState };
    }),
    on(dashboardActions.loadTilesSuccess, (state, action) => {
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          dashboardSetting: {
            ...state[key].dashboardSetting,
            viewportReady: true,
          },
          tiles: [...action.tiles],
        };
      }
      return { ...newState };
    }),
    on(dashboardActions.setGridViewport, (state, action) => {
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const dashboardConfig = viewportConfig(oldState.dashboardConfig, action.width, action.height);
        newState[key] = {
          ...state[key],
          dashboardConfig,
          dashboardSetting: viewportSetting(dashboardConfig, state[key].dashboardSetting),
        };
      }
      return { ...newState };
    }),
    on(dashboardActions.loadGridMapAndTiles, (state, action) => {
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          dashboardSetting: {
            ...state[key].dashboardSetting,
            gridMap: action.gridMap,
          },
          tiles: action.tiles,
        };
      }
      return { ...newState };
    }),
    on(dashboardActions.removeStore, (state, action) => {
      const key = action.dashboardId;
      const newState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
