import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { EntityTabsState, entityTabsAdapter, getEntityTabsFeatureKey } from './entity-tabs-state.model';
import { AppEntityTab } from '../models/entity-tabs.model';
import { FEATURE_NAME } from '../models/feature-name.enum';

/**
 * Cache for storing selectors by feature name.
 * Prevents recreation of selectors on each call.
 */
const entityTabsSelectorsByFeature = new Map<string, EntityTabsSelectors>();

/**
 * Interface defining the shape of selector set for a feature.
 */
export interface EntityTabsSelectors {
  selectEntityTabsState: MemoizedSelector<object, EntityTabsState>;
  selectAllTabs: MemoizedSelector<object, AppEntityTab[]>;
  selectTabEntities: MemoizedSelector<object, Dictionary<AppEntityTab>>;
  selectTabIds: MemoizedSelector<object, string[] | number[]>;
  selectTotalTabs: MemoizedSelector<object, number>;
  selectActiveTabId: MemoizedSelector<object, string | null>;
  selectActiveTab: MemoizedSelector<object, AppEntityTab | null>;
  selectIsLoading: MemoizedSelector<object, boolean>;
  selectIsSaving: MemoizedSelector<object, boolean>;
  selectIsDeleting: MemoizedSelector<object, boolean>;
  selectError: MemoizedSelector<object, string | null>;
  selectHasDirtyTabs: MemoizedSelector<object, boolean>;
  selectDirtyTabs: MemoizedSelector<object, AppEntityTab[]>;
  selectEditingTabs: MemoizedSelector<object, AppEntityTab[]>;
  selectTabById: (tabId: string) => MemoizedSelector<object, AppEntityTab | null>;
}

/**
 * Factory function to create selectors for a specific feature.
 * Selectors are cached to prevent recreation.
 */
export function createEntityTabsSelectorsForFeature(featureName: FEATURE_NAME | string): EntityTabsSelectors {
  // Return cached selectors if available
  const cached = entityTabsSelectorsByFeature.get(featureName);
  if (cached) {
    return cached;
  }

  const featureKey = getEntityTabsFeatureKey(featureName);

  // Feature state selector
  const selectEntityTabsState = createFeatureSelector<EntityTabsState>(featureKey);

  // Get entity adapter selectors
  const { selectAll, selectEntities, selectIds, selectTotal } = entityTabsAdapter.getSelectors();

  // Entity Selectors
  const selectAllTabs = createSelector(selectEntityTabsState, selectAll);

  const selectTabEntities = createSelector(selectEntityTabsState, selectEntities);

  const selectTabIds = createSelector(selectEntityTabsState, selectIds);

  const selectTotalTabs = createSelector(selectEntityTabsState, selectTotal);

  // Active Tab Selectors
  const selectActiveTabId = createSelector(selectEntityTabsState, (state) => state.activeTabId);

  const selectActiveTab = createSelector(selectTabEntities, selectActiveTabId, (entities, activeTabId) =>
    activeTabId ? (entities[activeTabId] ?? null) : null,
  );

  // Loading State Selectors
  const selectIsLoading = createSelector(selectEntityTabsState, (state) => state.isLoading);

  const selectIsSaving = createSelector(selectEntityTabsState, (state) => state.isSaving);

  const selectIsDeleting = createSelector(selectEntityTabsState, (state) => state.isDeleting);

  // Error Selector
  const selectError = createSelector(selectEntityTabsState, (state) => state.error);

  // Dirty State Selectors
  const selectHasDirtyTabs = createSelector(selectEntityTabsState, (state) => state.hasDirtyTabs);

  const selectDirtyTabs = createSelector(selectAllTabs, (tabs) => tabs.filter((tab) => tab.dirty));

  // Editing State Selector
  const selectEditingTabs = createSelector(selectAllTabs, (tabs) => tabs.filter((tab) => tab.editing));

  // Select Tab by ID factory
  const selectTabById = (tabId: string) => createSelector(selectTabEntities, (entities) => entities[tabId] ?? null);

  const selectorSet: EntityTabsSelectors = {
    selectEntityTabsState,
    selectAllTabs,
    selectTabEntities,
    selectTabIds,
    selectTotalTabs,
    selectActiveTabId,
    selectActiveTab,
    selectIsLoading,
    selectIsSaving,
    selectIsDeleting,
    selectError,
    selectHasDirtyTabs,
    selectDirtyTabs,
    selectEditingTabs,
    selectTabById,
  };

  // Cache the selectors
  entityTabsSelectorsByFeature.set(featureName, selectorSet);

  return selectorSet;
}

/**
 * Get cached selectors for a feature.
 * Returns undefined if selectors haven't been created yet.
 */
export function getEntityTabsSelectorsForFeature(featureName: FEATURE_NAME | string): EntityTabsSelectors | undefined {
  return entityTabsSelectorsByFeature.get(featureName);
}

/**
 * Clear cached selectors for a feature.
 * Useful for testing or cleanup.
 */
export function clearEntityTabsSelectorsForFeature(featureName: FEATURE_NAME | string): void {
  entityTabsSelectorsByFeature.delete(featureName);
}
