import { createFeature, createReducer, on } from '@ngrx/store';
import { DashboardState, defaultDashboardState } from '../models/dashboard.model';
import { viewportConfig, viewportSetting } from '../utils/viewport-setting';
import { dashboardActions } from './dashboard.actions';

export const initialState: DashboardState = {};

export const gnroDashboardFeature = createFeature({
  name: 'gnroDashboard',
  reducer: createReducer(
    initialState,
    on(dashboardActions.initDashboardConfig, (state, action) => {
      const dashboardConfig = { ...action.dashboardConfig };
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
      const setting = {
        ...defaultDashboardState.dashboardSetting,
        dashboardId: action.dashboardId,
        viewportReady: !dashboardConfig.remoteConfig,
      };
      newState[key] = {
        ...defaultDashboardState,
        dashboardConfig,
        dashboardSetting: viewportSetting(dashboardConfig, setting),
      };
      return { ...newState };
    }),
    on(dashboardActions.loadDashboardConfigSuccess, (state, action) => {
      const dashboardConfig = { ...action.dashboardConfig };
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
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
    on(dashboardActions.loadDashboardOptions, (state, action) => {
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
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
    on(dashboardActions.loadDashboardTilesSuccess, (state, action) => {
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
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
      const newState: DashboardState = { ...state };
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
    on(dashboardActions.loadDashboardGridMapAndTiles, (state, action) => {
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
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
    on(dashboardActions.removeDashboardStore, (state, action) => {
      const key = action.dashboardId;
      const newState: DashboardState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
