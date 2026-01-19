import { inject, Injectable, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ReducerManager } from '@ngrx/store';
import { GnroTabsEffects } from './tabs.effects';
import { createTabsReducerForFeature, getTabsFeatureKey } from './tabs.reducer';
import { createTabsSelectorsForFeature } from './tabs.selectors';

// Track registered features to avoid duplicate registration
const registeredTabsFeatures = new Set<string>();

@Injectable({ providedIn: 'root' })
export class GnroTabsFeatureService {
  private readonly reducerManager = inject(ReducerManager);

  registerFeature(tabsName: string): void {
    if (registeredTabsFeatures.has(tabsName)) {
      return;
    }

    const featureKey = getTabsFeatureKey(tabsName);
    const reducer = createTabsReducerForFeature(tabsName);

    this.reducerManager.addReducer(featureKey, reducer);
    // Pre-create selectors for this feature
    createTabsSelectorsForFeature(tabsName);
    registeredTabsFeatures.add(tabsName);
  }

  removeFeature(tabsName: string): void {
    const featureKey = getTabsFeatureKey(tabsName);
    this.reducerManager.removeReducer(featureKey);
    registeredTabsFeatures.delete(tabsName);
  }
}

@NgModule({
  imports: [EffectsModule.forFeature([GnroTabsEffects])],
})
export class GnroTabsStateModule {}
