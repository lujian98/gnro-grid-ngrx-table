import { Injectable, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { entityTabsActions } from './entity-tabs.actions';
import { createEntityTabsSelectorsForFeature, EntityTabsSelectors } from './entity-tabs.selectors';
import { AppEntityTab } from '../models/entity-tabs.model';
import { FEATURE_NAME } from '../models/feature-name.enum';

/**
 * Facade service providing a Signal-based API for entity tabs state management.
 * Shields components from direct store access and provides a clean, reactive interface.
 */
@Injectable({
  providedIn: 'root',
})
export class EntityTabsFacade {
  private readonly store = inject(Store);
  private currentFeature: FEATURE_NAME | string | null = null;
  private selectors: EntityTabsSelectors | null = null;

  // ========== Initialization ==========

  /**
   * Initialize the facade for a specific feature.
   * Must be called before using any other methods.
   */
  initializeFeature(featureName: FEATURE_NAME | string): void {
    this.currentFeature = featureName;
    this.selectors = createEntityTabsSelectorsForFeature(featureName);
  }

  /**
   * Get the currently initialized feature name.
   */
  getCurrentFeature(): FEATURE_NAME | string | null {
    return this.currentFeature;
  }

  /**
   * Check if a feature is currently initialized.
   */
  isInitialized(): boolean {
    return this.currentFeature !== null && this.selectors !== null;
  }

  // ========== Private Helper ==========

  private ensureInitialized(): void {
    if (!this.currentFeature || !this.selectors) {
      throw new Error('EntityTabsFacade: Feature not initialized. Call initializeFeature() first.');
    }
  }

  private getFeatureName(): FEATURE_NAME | string {
    this.ensureInitialized();
    return this.currentFeature!;
  }

  // ========== Data Accessors (Signals) ==========

  /**
   * Get all tabs as a Signal.
   */
  getTabs(): Signal<AppEntityTab[]> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectAllTabs), {
      initialValue: [],
    });
  }

  /**
   * Get the active tab ID as a Signal.
   */
  getActiveTabId(): Signal<string | null> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectActiveTabId), {
      initialValue: null,
    });
  }

  /**
   * Get the active tab as a Signal.
   */
  getActiveTab(): Signal<AppEntityTab | null> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectActiveTab), {
      initialValue: null,
    });
  }

  /**
   * Get a specific tab by ID as a Signal.
   */
  getTabById(tabId: string): Signal<AppEntityTab | null> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectTabById(tabId)), {
      initialValue: null,
    });
  }

  /**
   * Get total number of tabs as a Signal.
   */
  getTotalTabs(): Signal<number> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectTotalTabs), {
      initialValue: 0,
    });
  }

  /**
   * Get dirty tabs as a Signal.
   */
  getDirtyTabs(): Signal<AppEntityTab[]> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectDirtyTabs), {
      initialValue: [],
    });
  }

  /**
   * Get editing tabs as a Signal.
   */
  getEditingTabs(): Signal<AppEntityTab[]> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectEditingTabs), {
      initialValue: [],
    });
  }

  // ========== Loading State Accessors ==========

  /**
   * Get loading state as a Signal.
   */
  getIsLoading(): Signal<boolean> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectIsLoading), {
      initialValue: false,
    });
  }

  /**
   * Get saving state as a Signal.
   */
  getIsSaving(): Signal<boolean> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectIsSaving), {
      initialValue: false,
    });
  }

  /**
   * Get deleting state as a Signal.
   */
  getIsDeleting(): Signal<boolean> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectIsDeleting), {
      initialValue: false,
    });
  }

  /**
   * Get error message as a Signal.
   */
  getError(): Signal<string | null> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectError), {
      initialValue: null,
    });
  }

  /**
   * Get has dirty tabs flag as a Signal.
   */
  getHasDirtyTabs(): Signal<boolean> {
    this.ensureInitialized();
    return toSignal(this.store.select(this.selectors!.selectHasDirtyTabs), {
      initialValue: false,
    });
  }

  // ========== Tab Operations (Dispatch Actions) ==========

  /**
   * Load tabs for the current feature.
   */
  loadTabs(): void {
    this.store.dispatch(entityTabsActions.loadTabs({ featureName: this.getFeatureName() }));
  }

  /**
   * Set the active tab by ID.
   */
  setActiveTab(tabId: string): void {
    this.store.dispatch(
      entityTabsActions.setActiveTab({
        featureName: this.getFeatureName(),
        tabId,
      }),
    );
  }

  /**
   * Clear the active tab.
   */
  clearActiveTab(): void {
    this.store.dispatch(entityTabsActions.clearActiveTab({ featureName: this.getFeatureName() }));
  }

  /**
   * Add a new tab.
   */
  addTab(tab: AppEntityTab): void {
    this.store.dispatch(entityTabsActions.addTab({ featureName: this.getFeatureName(), tab }));
  }

  /**
   * Update an existing tab.
   */
  updateTab(tab: AppEntityTab): void {
    this.store.dispatch(entityTabsActions.updateTab({ featureName: this.getFeatureName(), tab }));
  }

  /**
   * Remove a tab by ID.
   */
  removeTab(tabId: string): void {
    this.store.dispatch(entityTabsActions.removeTab({ featureName: this.getFeatureName(), tabId }));
  }

  /**
   * Remove all tabs.
   */
  removeAllTabs(): void {
    this.store.dispatch(entityTabsActions.removeAllTabs({ featureName: this.getFeatureName() }));
  }

  /**
   * Save a single tab.
   */
  saveTab(tab: AppEntityTab): void {
    this.store.dispatch(entityTabsActions.saveTab({ featureName: this.getFeatureName(), tab }));
  }

  /**
   * Save all dirty tabs.
   */
  saveAllDirtyTabs(): void {
    this.store.dispatch(entityTabsActions.saveAllDirtyTabs({ featureName: this.getFeatureName() }));
  }

  // ========== Tab State Management ==========

  /**
   * Mark a tab as dirty or clean.
   */
  markTabDirty(tabId: string, isDirty: boolean): void {
    this.store.dispatch(
      entityTabsActions.markTabDirty({
        featureName: this.getFeatureName(),
        tabId,
        isDirty,
      }),
    );
  }

  /**
   * Set a tab's editing state.
   */
  setTabEditing(tabId: string, isEditing: boolean): void {
    this.store.dispatch(
      entityTabsActions.setTabEditing({
        featureName: this.getFeatureName(),
        tabId,
        isEditing,
      }),
    );
  }

  /**
   * Update a tab's values.
   */
  updateTabValues(tabId: string, values: object): void {
    this.store.dispatch(
      entityTabsActions.updateTabValues({
        featureName: this.getFeatureName(),
        tabId,
        values,
      }),
    );
  }

  /**
   * Revert a tab's changes to original values.
   */
  revertTabChanges(tabId: string): void {
    this.store.dispatch(
      entityTabsActions.revertTabChanges({
        featureName: this.getFeatureName(),
        tabId,
      }),
    );
  }

  // ========== Error & State Management ==========

  /**
   * Clear the error message.
   */
  clearError(): void {
    this.store.dispatch(entityTabsActions.clearError({ featureName: this.getFeatureName() }));
  }

  /**
   * Reset the state to initial values.
   */
  resetState(): void {
    this.store.dispatch(entityTabsActions.resetState({ featureName: this.getFeatureName() }));
  }
}
