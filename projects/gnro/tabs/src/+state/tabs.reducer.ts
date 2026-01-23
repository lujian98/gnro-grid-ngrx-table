import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Action } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';
import { defaultTabsState, GnroTabsState } from '../models/tabs.model';
import { contextClickedTabs } from '../utils/context-clicked-tabs';
import { getSelectedTabIndex } from '../utils/selected-tab-index';
import { tabsActions } from './tabs.actions';

// Feature key generator for per-tabsName feature slices
export function getTabsFeatureKey(tabsName: string): string {
  return `tabs_${tabsName}`;
}

// Initial state factory for per-tabsName state
export function getInitialTabsState<T>(tabsName: string): GnroTabsState<T> {
  return {
    ...defaultTabsState(),
    tabsConfig: {
      ...defaultTabsState().tabsConfig,
      tabsName,
    },
    tabsSetting: {
      ...defaultTabsState().tabsSetting,
    },
  };
}

// Cache for reducers by tabsName
const tabsReducersByFeature = new Map<
  string,
  (state: GnroTabsState<unknown> | undefined, action: Action) => GnroTabsState<unknown>
>();

// Factory function to create per-tabsName reducers
export function createTabsReducerForFeature(tabsName: string) {
  // Return cached reducer if available
  const cached = tabsReducersByFeature.get(tabsName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialTabsState<unknown>(tabsName);

  const tabsReducer = createReducer(
    initialState,
    on(tabsActions.initConfig, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      const tabsConfig = { ...action.tabsConfig };
      // Set urlKey to tabsName if urlKey is empty
      const urlKey = tabsConfig.urlKey || tabsConfig.tabsName;
      // Always start from fresh initial state
      const freshState = getInitialTabsState<unknown>(tabsName);
      return {
        ...freshState,
        tabsConfig: {
          ...tabsConfig,
          urlKey,
        },
        tabsSetting: {
          ...freshState.tabsSetting,
          viewportReady: !tabsConfig.remoteConfig,
        },
      };
    }),
    on(tabsActions.loadConfigSuccess, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      const tabsConfig = { ...action.tabsConfig };
      return {
        ...state,
        tabsConfig: {
          ...tabsConfig,
        },
        tabsSetting: {
          ...state.tabsSetting,
          viewportReady: true,
        },
      };
    }),
    on(tabsActions.loadOptions, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      return {
        ...state,
        tabsSetting: {
          ...state.tabsSetting,
          viewportReady: true,
        },
        options: [...action.options],
      };
    }),
    on(tabsActions.loadTabsSuccess, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      return {
        ...state,
        tabsSetting: {
          ...state.tabsSetting,
          viewportReady: true,
        },
        tabs: [...action.tabs],
      };
    }),
    on(tabsActions.setSelectedIndex, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      return {
        ...state,
        tabsConfig: {
          ...state.tabsConfig,
          selectedTabIndex: action.index,
        },
      };
    }),
    on(tabsActions.addTab, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      let selectedTabIndex = state.tabsConfig.selectedTabIndex;
      let tabs = [...state.tabs];
      const find = state.tabs.findIndex((item) => item.name === action.tab.name);
      if (find === -1) {
        const tab = state.options.find((option) => option.name === action.tab.portalName);
        const newtabs = [...state.tabs];
        if (tab) {
          newtabs.push({ ...tab, ...action.tab });
        } else {
          newtabs.push({ ...action.tab });
        }
        tabs = [...newtabs];
        selectedTabIndex = tabs.length - 1;
      } else {
        selectedTabIndex = find;
      }
      return {
        ...state,
        tabsConfig: {
          ...state.tabsConfig,
          selectedTabIndex,
        },
        tabs,
      };
    }),
    on(tabsActions.dragDropTab, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      const tabs = [...state.tabs];
      const prevActive = tabs[state.tabsConfig.selectedTabIndex];
      moveItemInArray(tabs, action.previousIndex, action.currentIndex);
      return {
        ...state,
        tabsConfig: {
          ...state.tabsConfig,
          selectedTabIndex: tabs.indexOf(prevActive),
        },
        tabs,
      };
    }),
    on(tabsActions.contextMenuClicked, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      const oldTabs = state.tabs;
      const prevActive = oldTabs[state.tabsConfig.selectedTabIndex];
      const tabs = contextClickedTabs(action.menuItem, oldTabs, action.tab, action.index);
      return {
        ...state,
        tabsConfig: {
          ...state.tabsConfig,
          selectedTabIndex: getSelectedTabIndex(tabs, prevActive),
        },
        tabs,
      };
    }),
    on(tabsActions.closeTab, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      const oldTabs = state.tabs;
      const prevActive = oldTabs[state.tabsConfig.selectedTabIndex];
      const tabs = [...oldTabs].filter((item) => item.name !== action.tab.name);
      return {
        ...state,
        tabsConfig: {
          ...state.tabsConfig,
          selectedTabIndex: getSelectedTabIndex(tabs, prevActive),
        },
        tabs,
      };
    }),
    on(tabsActions.removeStore, (state, action) => {
      if (action.tabsName !== tabsName) return state;
      // Reset to initial state
      return getInitialTabsState<unknown>(tabsName);
    }),
  );

  const reducer = (state: GnroTabsState<unknown> | undefined, action: Action): GnroTabsState<unknown> => {
    return tabsReducer(state, action);
  };

  tabsReducersByFeature.set(tabsName, reducer);
  return reducer;
}
