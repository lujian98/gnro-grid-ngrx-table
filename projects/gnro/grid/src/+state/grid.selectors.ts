import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { defaultState } from '../models/default-grid';
import {
  GnroColumnConfig,
  GnroGridConfig,
  GnroGridRowSelections,
  GnroGridSetting,
  GnroGridState,
} from '../models/grid.model';
import { GnroFormWindowConfig } from '@gnro/ui/form-window';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import { getGridFeatureKey } from './grid.reducer';

// Selector types for the factory
export interface GridSelectors {
  selectGridConfig: MemoizedSelector<object, GnroGridConfig>;
  selectGridSetting: MemoizedSelector<object, GnroGridSetting>;
  selectColumnsConfig: MemoizedSelector<object, GnroColumnConfig[]>;
  selectGridData: MemoizedSelector<object, unknown[]>;
  selectGridModifiedRecords: MemoizedSelector<object, unknown[]>;
  selectRowSelection: MemoizedSelector<object, GnroGridRowSelections<unknown> | undefined>;
  selectRowGroups: MemoizedSelector<object, GnroRowGroups | boolean>;
  selectGridInMemoryData: MemoizedSelector<object, unknown[]>;
  selectFormWindowConfig: MemoizedSelector<object, GnroFormWindowConfig | undefined>;
}

// Cache for selectors by gridName
const gridSelectorsByFeature = new Map<string, GridSelectors>();

// Factory function to create per-gridName selectors with memoization
export function createGridSelectorsForFeature(gridName: string): GridSelectors {
  // Return cached selectors if available
  const cached = gridSelectorsByFeature.get(gridName);
  if (cached) {
    return cached;
  }

  const featureKey = getGridFeatureKey(gridName);
  const selectGridFeatureState = createFeatureSelector<GnroGridState<unknown>>(featureKey);

  const selectGridConfig = createSelector(selectGridFeatureState, (state) =>
    state ? state.gridConfig : defaultState().gridConfig,
  );

  const selectGridSetting = createSelector(selectGridFeatureState, (state) =>
    state ? state.gridSetting : defaultState().gridSetting,
  );

  const selectColumnsConfig = createSelector(selectGridFeatureState, (state) => (state ? state.columnsConfig : []));

  const selectGridData = createSelector(selectGridFeatureState, (state) => (state ? state.data : []));

  const selectGridModifiedRecords = createSelector(selectGridFeatureState, (state) => (state ? state.modified : []));

  const selectRowSelection = createSelector(selectGridFeatureState, (state) => (state ? state.selection : undefined));

  const selectRowGroups = createSelector(selectGridFeatureState, (state): GnroRowGroups | boolean =>
    state?.rowGroups ? state.rowGroups : true,
  );

  const selectGridInMemoryData = createSelector(selectGridFeatureState, (state) => (state ? state.inMemoryData : []));

  const selectFormWindowConfig = createSelector(selectGridFeatureState, (state) =>
    state ? state.formWindowConfig : undefined,
  );

  const selectors: GridSelectors = {
    selectGridConfig,
    selectGridSetting,
    selectColumnsConfig,
    selectGridData,
    selectGridModifiedRecords,
    selectRowSelection,
    selectRowGroups,
    selectGridInMemoryData,
    selectFormWindowConfig,
  };

  gridSelectorsByFeature.set(gridName, selectors);
  return selectors;
}
