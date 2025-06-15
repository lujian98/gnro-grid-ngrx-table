import { createSelector } from '@ngrx/store';
import { TabsState, defaultTabsState } from '../models/tabs.model';

export interface AppTabsState {
  gnroTabs: TabsState;
}

export const featureSelector = (state: AppTabsState) => state.gnroTabs;

export const selectTabsSetting = (tabsId: string) =>
  createSelector(featureSelector, (state: TabsState) => {
    const tabsSetting = state && state[tabsId] ? state[tabsId].tabsSetting : undefined;
    return tabsSetting && tabsSetting.viewportReady ? tabsSetting : defaultTabsState.tabsSetting;
  });

export const selectTabsConfig = (tabsId: string) =>
  createSelector(featureSelector, (state: TabsState) => {
    const tabsConfig = state && state[tabsId] ? state[tabsId].tabsConfig : undefined;
    return tabsConfig && state[tabsId].tabsSetting.viewportReady ? tabsConfig : defaultTabsState.tabsConfig;
  });

export const selectTabsTabs = (tabsId: string) =>
  createSelector(featureSelector, (state: TabsState) => {
    return state && state[tabsId] ? state[tabsId].tabs : [];
  });

export const selectTabsOptions = (tabsId: string) =>
  createSelector(featureSelector, (state: TabsState) => {
    return state && state[tabsId] ? state[tabsId].options : [];
  });
