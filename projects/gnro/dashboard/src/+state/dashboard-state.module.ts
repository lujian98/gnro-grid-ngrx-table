import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroDashboardEffects } from './dashboard.effects';
import { createDashboardReducerForFeature, getDashboardFeatureKey } from './dashboard.reducer';
import { createDashboardSelectorsForFeature } from './dashboard.selectors';

// Set to track registered features
const registeredDashboardFeatures = new Set<string>();

// Service for dynamic feature registration
@Injectable({ providedIn: 'root' })
export class GnroDashboardFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  /**
   * Dynamically registers a dashboard feature if not already registered.
   * Call this before using the dashboard with a specific dashboardName.
   */
  registerFeature(dashboardName: string): void {
    if (registeredDashboardFeatures.has(dashboardName)) {
      return; // Already registered
    }

    const featureKey = getDashboardFeatureKey(dashboardName);
    const reducer = createDashboardReducerForFeature(dashboardName);

    // Register the reducer dynamically
    this.reducerManager.addReducer(featureKey, reducer);

    // Pre-create selectors for this feature
    createDashboardSelectorsForFeature(dashboardName);

    registeredDashboardFeatures.add(dashboardName);
  }

  /**
   * Removes a dashboard feature registration (for cleanup).
   */
  removeFeature(dashboardName: string): void {
    if (!registeredDashboardFeatures.has(dashboardName)) {
      return;
    }

    const featureKey = getDashboardFeatureKey(dashboardName);
    this.reducerManager.removeReducer(featureKey);
    registeredDashboardFeatures.delete(dashboardName);
  }

  /**
   * Check if a feature is registered.
   */
  isFeatureRegistered(dashboardName: string): boolean {
    return registeredDashboardFeatures.has(dashboardName);
  }
}

@NgModule({
  imports: [EffectsModule.forFeature([GnroDashboardEffects])],
})
export class GnroDashboardStateModule {}
