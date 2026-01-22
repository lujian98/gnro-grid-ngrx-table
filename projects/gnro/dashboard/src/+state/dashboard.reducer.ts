import { Action, createReducer, on } from '@ngrx/store';
import { defaultDashboardState, GnroDashboardState } from '../models/dashboard.model';
import { viewportConfig, viewportSetting } from '../utils/viewport-setting';
import { dashboardActions } from './dashboard.actions';

// Feature key generator for per-dashboardName feature slices
export function getDashboardFeatureKey(dashboardName: string): string {
  return `dashboard_${dashboardName}`;
}

// Initial state factory for per-dashboardName state
export function getInitialDashboardState<T>(dashboardName: string): GnroDashboardState<T> {
  return {
    ...defaultDashboardState(),
    dashboardConfig: {
      ...defaultDashboardState().dashboardConfig,
      dashboardName,
    },
  };
}

// Cache for reducers by dashboardName
const dashboardReducersByFeature = new Map<
  string,
  (state: GnroDashboardState<unknown> | undefined, action: Action) => GnroDashboardState<unknown>
>();

// Factory function to create per-dashboardName reducers
export function createDashboardReducerForFeature(dashboardName: string) {
  // Return cached reducer if available
  const cached = dashboardReducersByFeature.get(dashboardName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialDashboardState<unknown>(dashboardName);

  const dashboardReducer = createReducer(
    initialState,
    on(dashboardActions.initConfig, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      const dashboardConfig = { ...action.dashboardConfig };
      // Always start from fresh initial state to avoid stale data
      const freshState = getInitialDashboardState<unknown>(dashboardName);
      const setting = {
        ...freshState.dashboardSetting,
        viewportReady: !dashboardConfig.remoteConfig,
      };
      return {
        ...freshState,
        dashboardConfig,
        dashboardSetting: viewportSetting(dashboardConfig, setting),
      };
    }),
    on(dashboardActions.loadConfigSuccess, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      const dashboardConfig = { ...action.dashboardConfig };
      const setting = {
        ...state.dashboardSetting,
        viewportReady: true,
      };
      return {
        ...state,
        dashboardConfig,
        dashboardSetting: viewportSetting(dashboardConfig, setting),
      };
    }),
    on(dashboardActions.loadOptions, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      return {
        ...state,
        dashboardSetting: {
          ...state.dashboardSetting,
          viewportReady: true,
        },
        options: [...action.options] as GnroDashboardState<unknown>['options'],
      };
    }),
    on(dashboardActions.loadTilesSuccess, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      return {
        ...state,
        dashboardSetting: {
          ...state.dashboardSetting,
          viewportReady: true,
        },
        tiles: [...action.tiles] as GnroDashboardState<unknown>['tiles'],
      };
    }),
    on(dashboardActions.setGridViewport, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      const dashboardConfig = viewportConfig(state.dashboardConfig, action.width, action.height);
      return {
        ...state,
        dashboardConfig,
        dashboardSetting: viewportSetting(dashboardConfig, state.dashboardSetting),
      };
    }),
    on(dashboardActions.loadGridMapAndTiles, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      return {
        ...state,
        dashboardSetting: {
          ...state.dashboardSetting,
          gridMap: action.gridMap,
        },
        tiles: action.tiles as GnroDashboardState<unknown>['tiles'],
      };
    }),
    on(dashboardActions.removeStore, (state, action) => {
      if (action.dashboardName !== dashboardName) return state;
      return getInitialDashboardState<unknown>(dashboardName);
    }),
  );

  const reducerFn = (state: GnroDashboardState<unknown> | undefined, action: Action): GnroDashboardState<unknown> => {
    return dashboardReducer(state, action);
  };

  dashboardReducersByFeature.set(dashboardName, reducerFn);
  return reducerFn;
}
