import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroSelectFieldEffects } from './select-field.effects';
import { createSelectFieldReducerForFeature, getSelectFieldFeatureKey } from './select-field.reducer';
import { createSelectFieldSelectorsForFeature } from './select-field.selectors';

// Set to track registered features
const registeredSelectFieldFeatures = new Set<string>();

// Service for dynamic feature registration
@Injectable({ providedIn: 'root' })
export class GnroSelectFieldFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  /**
   * Dynamically registers a SelectField feature if not already registered.
   * Call this before using the SelectField component with a specific fieldName.
   */
  registerFeature(fieldName: string): void {
    if (registeredSelectFieldFeatures.has(fieldName)) {
      return; // Already registered
    }

    const featureKey = getSelectFieldFeatureKey(fieldName);
    const reducer = createSelectFieldReducerForFeature(fieldName);

    // Register the reducer dynamically
    this.reducerManager.addReducer(featureKey, reducer);

    // Pre-create selectors for this feature
    createSelectFieldSelectorsForFeature(fieldName);

    registeredSelectFieldFeatures.add(fieldName);
  }

  /**
   * Removes a SelectField feature registration (for cleanup).
   */
  removeFeature(fieldName: string): void {
    if (!registeredSelectFieldFeatures.has(fieldName)) {
      return;
    }

    const featureKey = getSelectFieldFeatureKey(fieldName);
    this.reducerManager.removeReducer(featureKey);
    registeredSelectFieldFeatures.delete(fieldName);
  }

  /**
   * Check if a feature is registered.
   */
  isFeatureRegistered(fieldName: string): boolean {
    return registeredSelectFieldFeatures.has(fieldName);
  }
}

@NgModule({
  imports: [EffectsModule.forFeature([GnroSelectFieldEffects])],
})
export class GnroSelectFieldStateModule {}
