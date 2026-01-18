import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroGridEffects } from './grid.effects';
import { createGridReducerForFeature, getGridFeatureKey } from './grid.reducer';
import { GnroFormWindowStateModule } from '@gnro/ui/form-window';
import { GnroRemoteStateModule } from '@gnro/ui/remote';
import { createGridSelectorsForFeature } from './grid.selectors';

// Set to track registered features
const registeredGridFeatures = new Set<string>();

// Service for dynamic feature registration
@Injectable({ providedIn: 'root' })
export class GnroGridFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  /**
   * Dynamically registers a grid feature if not already registered.
   * Call this before using the grid with a specific gridName.
   */
  registerFeature(gridName: string): void {
    if (registeredGridFeatures.has(gridName)) {
      return; // Already registered
    }

    const featureKey = getGridFeatureKey(gridName);
    const reducer = createGridReducerForFeature(gridName);

    // Register the reducer dynamically
    this.reducerManager.addReducer(featureKey, reducer);

    // Pre-create selectors for this feature
    createGridSelectorsForFeature(gridName);

    registeredGridFeatures.add(gridName);
  }

  /**
   * Removes a grid feature registration (for cleanup).
   */
  removeFeature(gridName: string): void {
    if (!registeredGridFeatures.has(gridName)) {
      return;
    }

    const featureKey = getGridFeatureKey(gridName);
    this.reducerManager.removeReducer(featureKey);
    registeredGridFeatures.delete(gridName);
  }

  /**
   * Check if a feature is registered.
   */
  isFeatureRegistered(gridName: string): boolean {
    return registeredGridFeatures.has(gridName);
  }
}

@NgModule({
  imports: [GnroRemoteStateModule, GnroFormWindowStateModule, EffectsModule.forFeature([GnroGridEffects])],
})
export class GnroGridStateModule {}
