import { moveItemInArray } from '@angular/cdk/drag-drop';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultTabsState, TabsState } from '../models/tabs.model';
import { contextClickedTabs } from '../utils/context-clicked-tabs';
import { getSelectedTabIndex } from '../utils/selected-tab-index';
import { tabsActions } from './tabs.actions';

//export const initialState: TabsState = {};

const initialState = <T>(): TabsState<T> => {
  return {};
};

export const gnroTabsFeature = createFeature({
  name: 'gnroTabs',
  reducer: createReducer(
    initialState(),
    on(tabsActions.initConfig, (state, action) => {
      const tabsConfig = { ...action.tabsConfig };
      const key = action.tabsId;
      const newState = { ...state };
      newState[key] = {
        ...defaultTabsState,
        tabsConfig,
        tabsSetting: {
          ...defaultTabsState.tabsSetting,
          tabsId: action.tabsId,
          viewportReady: !tabsConfig.remoteConfig,
        },
      };
      return { ...newState };
    }),
    on(tabsActions.loadConfigSuccess, (state, action) => {
      const tabsConfig = { ...action.tabsConfig };
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...tabsConfig,
          },
          tabsSetting: {
            ...state[key].tabsSetting,
            viewportReady: true,
          },
        };
      }
      return { ...newState };
    }),
    on(tabsActions.loadOptions, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          tabsSetting: {
            ...state[key].tabsSetting,
            viewportReady: true,
          },
          options: [...action.options],
        };
      }
      return { ...newState };
    }),
    on(tabsActions.loadTabsSuccess, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          tabsSetting: {
            ...state[key].tabsSetting,
            viewportReady: true,
          },
          tabs: [...action.tabs],
        };
      }
      return { ...newState };
    }),
    on(tabsActions.setSelectedIndex, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...state[key].tabsConfig,
            selectedTabIndex: action.index,
          },
        };
      }
      return { ...newState };
    }),
    on(tabsActions.addTab, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        let selectedTabIndex = oldState.tabsConfig.selectedTabIndex;
        let tabs = [...oldState.tabs];
        const find = oldState.tabs.findIndex((item) => item.name === action.tab.name);
        if (find === -1) {
          const tab = oldState.options.find((option) => option.name === action.tab.portalName);
          const newtabs = [...oldState.tabs];
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
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...state[key].tabsConfig,
            selectedTabIndex,
          },
          tabs,
        };
      }
      return { ...newState };
    }),
    on(tabsActions.dragDropTab, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const tabs = oldState.tabs;
        const prevActive = tabs[oldState.tabsConfig.selectedTabIndex];
        moveItemInArray(tabs, action.previousIndex, action.currentIndex);
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...state[key].tabsConfig,
            selectedTabIndex: tabs.indexOf(prevActive),
          },
          tabs,
        };
      }
      return { ...newState };
    }),
    on(tabsActions.contextMenuClicked, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const oldTabs = oldState.tabs;
        const prevActive = oldTabs[oldState.tabsConfig.selectedTabIndex];
        const tabs = contextClickedTabs(action.menuItem, oldTabs, action.tab, action.index);
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...state[key].tabsConfig,
            selectedTabIndex: getSelectedTabIndex(tabs, prevActive),
          },
          tabs,
        };
      }
      return { ...newState };
    }),
    on(tabsActions.closeTab, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const oldTabs = oldState.tabs;
        const prevActive = oldTabs[oldState.tabsConfig.selectedTabIndex];
        const tabs = [...oldTabs].filter((item) => item.name !== action.tab.name);
        newState[key] = {
          ...state[key],
          tabsConfig: {
            ...state[key].tabsConfig,
            selectedTabIndex: getSelectedTabIndex(tabs, prevActive),
          },
          tabs,
        };
      }
      return { ...newState };
    }),
    on(tabsActions.removeStore, (state, action) => {
      const key = action.tabsId;
      const newState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
