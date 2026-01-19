import { Action, createReducer, on } from '@ngrx/store';
import { entityTabsActions } from './entity-tabs.actions';
import { EntityTabsState, entityTabsAdapter, getInitialEntityTabsState } from './entity-tabs-state.model';
import { FEATURE_NAME } from '../models/feature-name.enum';

/**
 * Factory function to create a reducer for a specific feature.
 * Each feature gets its own isolated state slice.
 */
export function createEntityTabsReducerForFeature(featureName: FEATURE_NAME | string) {
  const initialState = getInitialEntityTabsState(featureName);

  const entityTabsReducer = createReducer(
    initialState,

    // Load Tabs
    on(entityTabsActions.loadTabs, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }),

    on(entityTabsActions.loadTabsSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.setAll(action.tabs, {
        ...state,
        isLoading: false,
        error: null,
        activeTabId: action.tabs.length > 0 ? action.tabs[0].id : null,
      });
    }),

    on(entityTabsActions.loadTabsFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }),

    // Set Active Tab
    on(entityTabsActions.setActiveTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        activeTabId: action.tabId,
      };
    }),

    on(entityTabsActions.clearActiveTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        activeTabId: null,
      };
    }),

    // Add Tab
    on(entityTabsActions.addTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }),

    on(entityTabsActions.addTabSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.addOne(action.tab, {
        ...state,
        isLoading: false,
        activeTabId: action.tab.id,
      });
    }),

    on(entityTabsActions.addTabFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }),

    // Update Tab
    on(entityTabsActions.updateTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    }),

    on(entityTabsActions.updateTabSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.updateOne(
        { id: action.tab.id, changes: action.tab },
        {
          ...state,
          isSaving: false,
        },
      );
    }),

    on(entityTabsActions.updateTabFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: false,
        error: action.error,
      };
    }),

    // Remove Tab
    on(entityTabsActions.removeTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isDeleting: true,
        error: null,
      };
    }),

    on(entityTabsActions.removeTabSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const newState = entityTabsAdapter.removeOne(action.tabId, {
        ...state,
        isDeleting: false,
      });

      // If removed tab was active, select next available tab
      if (state.activeTabId === action.tabId) {
        const remainingIds = newState.ids as string[];
        newState.activeTabId = remainingIds.length > 0 ? remainingIds[0] : null;
      }

      return newState;
    }),

    on(entityTabsActions.removeTabFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isDeleting: false,
        error: action.error,
      };
    }),

    // Remove All Tabs
    on(entityTabsActions.removeAllTabs, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isDeleting: true,
      };
    }),

    on(entityTabsActions.removeAllTabsSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.removeAll({
        ...state,
        isDeleting: false,
        activeTabId: null,
        hasDirtyTabs: false,
      });
    }),

    // Save Tab
    on(entityTabsActions.saveTab, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    }),

    on(entityTabsActions.saveTabSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const updatedTab = {
        ...action.tab,
        dirty: false,
        originalValues: action.tab.values,
      };
      const newState = entityTabsAdapter.updateOne(
        { id: action.tab.id, changes: updatedTab },
        {
          ...state,
          isSaving: false,
        },
      );
      // Recalculate hasDirtyTabs
      const allTabs = Object.values(newState.entities);
      newState.hasDirtyTabs = allTabs.some((tab) => tab?.dirty);
      return newState;
    }),

    on(entityTabsActions.saveTabFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: false,
        error: action.error,
      };
    }),

    // Save All Dirty Tabs
    on(entityTabsActions.saveAllDirtyTabs, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    }),

    on(entityTabsActions.saveAllDirtyTabsSuccess, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const updates = action.tabs.map((tab) => ({
        id: tab.id,
        changes: {
          ...tab,
          dirty: false,
          originalValues: tab.values,
        },
      }));
      return entityTabsAdapter.updateMany(updates, {
        ...state,
        isSaving: false,
        hasDirtyTabs: false,
      });
    }),

    on(entityTabsActions.saveAllDirtyTabsFailure, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        isSaving: false,
        error: action.error,
      };
    }),

    // Mark Tab Dirty
    on(entityTabsActions.markTabDirty, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const newState = entityTabsAdapter.updateOne({ id: action.tabId, changes: { dirty: action.isDirty } }, state);
      // Recalculate hasDirtyTabs
      const allTabs = Object.values(newState.entities);
      newState.hasDirtyTabs = allTabs.some((tab) => tab?.dirty);
      return newState;
    }),

    // Set Tab Editing
    on(entityTabsActions.setTabEditing, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.updateOne({ id: action.tabId, changes: { editing: action.isEditing } }, state);
    }),

    // Set Subtab Index
    on(entityTabsActions.setSubtabIndex, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return entityTabsAdapter.updateOne({ id: action.tabId, changes: { subtabIndex: action.subtabIndex } }, state);
    }),

    // Update Tab Values
    on(entityTabsActions.updateTabValues, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const tab = state.entities[action.tabId];
      if (!tab) return state;

      const isDirty = JSON.stringify(action.values) !== JSON.stringify(tab.originalValues);
      const newState = entityTabsAdapter.updateOne(
        {
          id: action.tabId,
          changes: {
            values: action.values,
            dirty: isDirty,
          },
        },
        state,
      );
      // Recalculate hasDirtyTabs
      const allTabs = Object.values(newState.entities);
      newState.hasDirtyTabs = allTabs.some((t) => t?.dirty);
      return newState;
    }),

    // Revert Tab Changes
    on(entityTabsActions.revertTabChanges, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      const tab = state.entities[action.tabId];
      if (!tab) return state;

      const newState = entityTabsAdapter.updateOne(
        {
          id: action.tabId,
          changes: {
            values: tab.originalValues,
            dirty: false,
          },
        },
        state,
      );
      // Recalculate hasDirtyTabs
      const allTabs = Object.values(newState.entities);
      newState.hasDirtyTabs = allTabs.some((t) => t?.dirty);
      return newState;
    }),

    // Clear Error
    on(entityTabsActions.clearError, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return {
        ...state,
        error: null,
      };
    }),

    // Reset State
    on(entityTabsActions.resetState, (state, action) => {
      if (action.featureName !== state.featureName) return state;
      return getInitialEntityTabsState(featureName);
    }),
  );

  return (state: EntityTabsState | undefined, action: Action): EntityTabsState => {
    return entityTabsReducer(state, action);
  };
}
