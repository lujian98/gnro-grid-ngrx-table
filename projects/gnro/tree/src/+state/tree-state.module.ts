import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroTreeEffects } from './tree.effects';
import { createTreeReducerForFeature, getTreeFeatureKey } from './tree.reducer';
import { createTreeSelectorsForFeature } from './tree.selectors';

// Set to track registered features
const registeredTreeFeatures = new Set<string>();

// Service for dynamic feature registration
@Injectable({ providedIn: 'root' })
export class GnroTreeFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  /**
   * Dynamically registers a tree feature if not already registered.
   * Call this before using the tree with a specific gridName.
   */
  registerFeature(gridName: string): void {
    if (registeredTreeFeatures.has(gridName)) {
      return; // Already registered
    }

    const featureKey = getTreeFeatureKey(gridName);
    const reducer = createTreeReducerForFeature(gridName);

    // Register the reducer dynamically
    this.reducerManager.addReducer(featureKey, reducer);

    // Pre-create selectors for this feature
    createTreeSelectorsForFeature(gridName);

    registeredTreeFeatures.add(gridName);
  }

  /**
   * Removes a tree feature registration (for cleanup).
   */
  removeFeature(gridName: string): void {
    if (!registeredTreeFeatures.has(gridName)) {
      return;
    }

    const featureKey = getTreeFeatureKey(gridName);
    this.reducerManager.removeReducer(featureKey);
    registeredTreeFeatures.delete(gridName);
  }

  /**
   * Check if a feature is registered.
   */
  isFeatureRegistered(gridName: string): boolean {
    return registeredTreeFeatures.has(gridName);
  }
}

@NgModule({
  imports: [EffectsModule.forFeature([GnroTreeEffects])],
})
export class GnroTreeStateModule {}
