// State Model
export {
  EntityTabsState,
  entityTabsAdapter,
  getInitialEntityTabsState,
  getEntityTabsFeatureKey,
} from './entity-tabs-state.model';

// Actions
export { entityTabsActions } from './entity-tabs.actions';

// Reducer
export { createEntityTabsReducerForFeature } from './entity-tabs.reducer';

// Selectors
export {
  EntityTabsSelectors,
  createEntityTabsSelectorsForFeature,
  getEntityTabsSelectorsForFeature,
  clearEntityTabsSelectorsForFeature,
} from './entity-tabs.selectors';

// Effects
export { EntityTabsEffects } from './entity-tabs.effects';

// Facade
export { EntityTabsFacade } from './entity-tabs.facade';
