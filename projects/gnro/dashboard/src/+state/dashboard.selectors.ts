import { createSelector } from '@ngrx/store';
import { DashboardState, defaultDashboardState } from '../models/dashboard.model';

export interface AppDashboardState<T> {
  gnroDashboard: DashboardState<T>;
}

export const featureSelector = <T>(state: AppDashboardState<T>) => state.gnroDashboard;

export const selectDashboardSetting = (dashboardId: string) =>
  createSelector(featureSelector, (state) => {
    const dashboardSetting = state && state[dashboardId] ? state[dashboardId].dashboardSetting : undefined;
    return dashboardSetting && dashboardSetting.viewportReady
      ? dashboardSetting
      : defaultDashboardState().dashboardSetting;
  });

export const selectDashboardConfig = (dashboardId: string) =>
  createSelector(featureSelector, (state) => {
    const dashboardConfig = state && state[dashboardId] ? state[dashboardId].dashboardConfig : undefined;
    return dashboardConfig && state[dashboardId].dashboardSetting.viewportReady
      ? dashboardConfig
      : defaultDashboardState().dashboardConfig;
  });

export const selectDashboardTiles = (dashboardId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[dashboardId] ? state[dashboardId].tiles : [];
  });
