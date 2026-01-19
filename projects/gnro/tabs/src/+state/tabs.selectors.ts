import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  GnroTabConfig,
  GnroTabOption,
  GnroTabsConfig,
  GnroTabsSetting,
  GnroTabsState,
  defaultTabsState,
} from '../models/tabs.model';
import { getTabsFeatureKey } from './tabs.reducer';

// Interface for all tabs selectors
export interface TabsSelectors {
  selectTabsFeatureState: MemoizedSelector<object, GnroTabsState<unknown>>;
  selectTabsConfig: MemoizedSelector<object, GnroTabsConfig>;
  selectTabsSetting: MemoizedSelector<object, GnroTabsSetting>;
  selectTabsTabs: MemoizedSelector<object, GnroTabConfig<unknown>[]>;
  selectTabsOptions: MemoizedSelector<object, GnroTabOption<unknown>[]>;
}

// Cache for selectors by tabsName
const tabsSelectorsByFeature = new Map<string, TabsSelectors>();

// Factory function to create per-tabsName selectors
export function createTabsSelectorsForFeature(tabsName: string): TabsSelectors {
  // Return cached selectors if available
  const cached = tabsSelectorsByFeature.get(tabsName);
  if (cached) {
    return cached;
  }

  const featureKey = getTabsFeatureKey(tabsName);

  // Feature state selector
  const selectTabsFeatureState = createFeatureSelector<GnroTabsState<unknown>>(featureKey);

  const selectTabsConfig = createSelector(selectTabsFeatureState, (state) =>
    state ? state.tabsConfig : defaultTabsState().tabsConfig,
  );

  const selectTabsSetting = createSelector(selectTabsFeatureState, (state) =>
    state ? state.tabsSetting : defaultTabsState().tabsSetting,
  );

  const selectTabsTabs = createSelector(selectTabsFeatureState, (state) => (state ? state.tabs : []));

  const selectTabsOptions = createSelector(selectTabsFeatureState, (state) => (state ? state.options : []));

  const selectors: TabsSelectors = {
    selectTabsFeatureState,
    selectTabsConfig,
    selectTabsSetting,
    selectTabsTabs,
    selectTabsOptions,
  };

  tabsSelectorsByFeature.set(tabsName, selectors);
  return selectors;
}
