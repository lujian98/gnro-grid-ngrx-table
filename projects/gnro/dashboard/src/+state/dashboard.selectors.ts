import { createSelector } from '@ngrx/store';
import { DashboardState, defaultDashboardState } from '../models/dashboard.model';

export interface AppDashboardState {
  gnroDashboard: DashboardState;
}

export const featureSelector = (state: AppDashboardState) => state.gnroDashboard;

export const selectDashboardSetting = (dashboardId: string) =>
  createSelector(featureSelector, (state: DashboardState) => {
    const dashboardSetting = state && state[dashboardId] ? state[dashboardId].dashboardSetting : undefined;
    return dashboardSetting && dashboardSetting.viewportReady
      ? dashboardSetting
      : defaultDashboardState.dashboardSetting;
  });

export const selectDashboardConfig = (dashboardId: string) =>
  createSelector(featureSelector, (state: DashboardState) => {
    const dashboardConfig = state && state[dashboardId] ? state[dashboardId].dashboardConfig : undefined;
    return dashboardConfig && state[dashboardId].dashboardSetting.viewportReady
      ? dashboardConfig
      : defaultDashboardState.dashboardConfig;
  });

export const selectDashboardTiles = (dashboardId: string) =>
  createSelector(featureSelector, (state: DashboardState) => {
    return state && state[dashboardId] ? state[dashboardId].tiles : [];
  });
