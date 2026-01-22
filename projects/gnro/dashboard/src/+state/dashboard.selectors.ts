import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  defaultDashboardState,
  GnroDashboardConfig,
  GnroDashboardSetting,
  GnroDashboardState,
  GnroTile,
} from '../models/dashboard.model';
import { getDashboardFeatureKey } from './dashboard.reducer';

// Selector types for the factory
export interface DashboardSelectors {
  selectDashboardConfig: MemoizedSelector<object, GnroDashboardConfig>;
  selectDashboardSetting: MemoizedSelector<object, GnroDashboardSetting>;
  selectDashboardTiles: MemoizedSelector<object, GnroTile<unknown>[]>;
  selectDashboardOptions: MemoizedSelector<object, GnroTile<unknown>[]>;
}

// Cache for selectors by dashboardName
const dashboardSelectorsByFeature = new Map<string, DashboardSelectors>();

// Factory function to create per-dashboardName selectors with memoization
export function createDashboardSelectorsForFeature(dashboardName: string): DashboardSelectors {
  // Return cached selectors if available
  const cached = dashboardSelectorsByFeature.get(dashboardName);
  if (cached) {
    return cached;
  }

  const featureKey = getDashboardFeatureKey(dashboardName);
  const selectDashboardFeatureState = createFeatureSelector<GnroDashboardState<unknown>>(featureKey);

  const selectDashboardConfig = createSelector(selectDashboardFeatureState, (state) =>
    state ? state.dashboardConfig : defaultDashboardState().dashboardConfig,
  );

  const selectDashboardSetting = createSelector(selectDashboardFeatureState, (state) =>
    state ? state.dashboardSetting : defaultDashboardState().dashboardSetting,
  );

  const selectDashboardTiles = createSelector(selectDashboardFeatureState, (state) => (state ? state.tiles : []));

  const selectDashboardOptions = createSelector(selectDashboardFeatureState, (state) => (state ? state.options : []));

  const selectors: DashboardSelectors = {
    selectDashboardConfig,
    selectDashboardSetting,
    selectDashboardTiles,
    selectDashboardOptions,
  };

  dashboardSelectorsByFeature.set(dashboardName, selectors);
  return selectors;
}
