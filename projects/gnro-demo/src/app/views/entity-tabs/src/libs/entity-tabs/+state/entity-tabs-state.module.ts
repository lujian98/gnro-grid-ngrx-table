import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FEATURE_NAME } from '../models/feature-name.enum';
import { getEntityTabsFeatureKey } from './entity-tabs-state.model';
import { createEntityTabsReducerForFeature } from './entity-tabs.reducer';
import { createEntityTabsSelectorsForFeature } from './entity-tabs.selectors';
import { EntityTabsEffects } from './entity-tabs.effects';

/**
 * NgModule for registering Entity Tabs NgRx state management.
 * Registers reducers for all features defined in FEATURE_NAME enum.
 *
 * Usage:
 * ```typescript
 * @Component({
 *   imports: [EntityTabsStateModule],
 * })
 * export class MyComponent {}
 * ```
 *
 * Or in routes:
 * ```typescript
 * {
 *   path: 'entity-tabs',
 *   loadComponent: () => import('./my.component'),
 *   providers: [importProvidersFrom(EntityTabsStateModule)],
 * }
 * ```
 */
@NgModule({
  imports: [
    // Register store features for each FEATURE_NAME
    StoreModule.forFeature(
      getEntityTabsFeatureKey(FEATURE_NAME.CIRCUITS),
      createEntityTabsReducerForFeature(FEATURE_NAME.CIRCUITS),
    ),
    StoreModule.forFeature(
      getEntityTabsFeatureKey(FEATURE_NAME.ITEMS),
      createEntityTabsReducerForFeature(FEATURE_NAME.ITEMS),
    ),
    StoreModule.forFeature(
      getEntityTabsFeatureKey(FEATURE_NAME.LOCATIONS),
      createEntityTabsReducerForFeature(FEATURE_NAME.LOCATIONS),
    ),
    StoreModule.forFeature(
      getEntityTabsFeatureKey(FEATURE_NAME.MODELS),
      createEntityTabsReducerForFeature(FEATURE_NAME.MODELS),
    ),

    // Register effects (single class handles all features)
    EffectsModule.forFeature([EntityTabsEffects]),
  ],
})
export class EntityTabsStateModule {
  constructor() {
    // Pre-create selectors for all features to ensure they're cached
    createEntityTabsSelectorsForFeature(FEATURE_NAME.CIRCUITS);
    createEntityTabsSelectorsForFeature(FEATURE_NAME.ITEMS);
    createEntityTabsSelectorsForFeature(FEATURE_NAME.LOCATIONS);
    createEntityTabsSelectorsForFeature(FEATURE_NAME.MODELS);
  }
}
