import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroD3Effects } from './d3.effects';
import { createD3ReducerForFeature, getD3FeatureKey } from './d3.reducer';
import { createD3SelectorsForFeature } from './d3.selectors';

// Set to track registered features
const registeredD3Features = new Set<string>();

// Service for dynamic feature registration
@Injectable({ providedIn: 'root' })
export class GnroD3FeatureService {
  private readonly reducerManager = inject(ReducerManager);

  /**
   * Dynamically registers a D3 feature if not already registered.
   * Call this before using the D3 component with a specific d3ChartName.
   */
  registerFeature(d3ChartName: string): void {
    if (registeredD3Features.has(d3ChartName)) {
      return; // Already registered
    }

    const featureKey = getD3FeatureKey(d3ChartName);
    const reducer = createD3ReducerForFeature(d3ChartName);

    // Register the reducer dynamically
    this.reducerManager.addReducer(featureKey, reducer);

    // Pre-create selectors for this feature
    createD3SelectorsForFeature(d3ChartName);

    registeredD3Features.add(d3ChartName);
  }

  /**
   * Removes a D3 feature registration (for cleanup).
   */
  removeFeature(d3ChartName: string): void {
    if (!registeredD3Features.has(d3ChartName)) {
      return;
    }

    const featureKey = getD3FeatureKey(d3ChartName);
    this.reducerManager.removeReducer(featureKey);
    registeredD3Features.delete(d3ChartName);
  }

  /**
   * Check if a feature is registered.
   */
  isFeatureRegistered(d3ChartName: string): boolean {
    return registeredD3Features.has(d3ChartName);
  }
}

@NgModule({
  imports: [EffectsModule.forFeature([GnroD3Effects])],
})
export class GnroD3StateModule {}
