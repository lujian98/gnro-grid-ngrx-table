import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AppEntityTab } from '../models/entity-tabs.model';
import { FEATURE_NAME } from '../models/feature-name.enum';

/**
 * Defines the shape of the entity tabs state for each feature.
 * Supports multiple entity tab details simultaneously.
 */
export interface EntityTabsState extends EntityState<AppEntityTab> {
  featureName: FEATURE_NAME | string;
  activeTabId: string | null;

  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;

  error: string | null;

  hasDirtyTabs: boolean;
}

/**
 * Entity adapter for normalized entity storage.
 * Uses 'id' as the unique identifier for each tab.
 * sortComparer is set to false to maintain insertion order (new tabs appended at end).
 */
export const entityTabsAdapter = createEntityAdapter<AppEntityTab>({
  selectId: (tab) => tab.id,
  sortComparer: false,
});

/**
 * Factory function to create initial state for a specific feature.
 */
export function getInitialEntityTabsState(featureName: FEATURE_NAME | string): EntityTabsState {
  return entityTabsAdapter.getInitialState({
    featureName,
    activeTabId: null,
    isLoading: false,
    isSaving: false,
    isDeleting: false,
    error: null,
    hasDirtyTabs: false,
  });
}

/**
 * Generates the feature key for NgRx store registration.
 */
export function getEntityTabsFeatureKey(featureName: FEATURE_NAME | string): string {
  return `entityTabs_${featureName}`;
}
