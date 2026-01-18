import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { GnroGridRowSelections } from '@gnro/ui/grid';
import { GnroTreeConfig, GnroTreeNode, GnroTreeState, defaultTreeState } from '../models/tree-grid.model';
import { getTreeFeatureKey } from './tree.reducer';

// Selector types for the factory
export interface TreeSelectors {
  selectTreeConfig: MemoizedSelector<object, GnroTreeConfig>;
  selectTreeData: MemoizedSelector<object, GnroTreeNode<unknown>[]>;
  selectTreeInMemoryData: MemoizedSelector<object, GnroTreeNode<unknown>[]>;
  selectRowSelection: MemoizedSelector<object, GnroGridRowSelections<GnroTreeNode<unknown>> | undefined>;
}

// Cache for selectors by gridName
const treeSelectorsByFeature = new Map<string, TreeSelectors>();

// Factory function to create per-gridName selectors with memoization
export function createTreeSelectorsForFeature(gridName: string): TreeSelectors {
  // Return cached selectors if available
  const cached = treeSelectorsByFeature.get(gridName);
  if (cached) {
    return cached;
  }

  const featureKey = getTreeFeatureKey(gridName);
  const selectTreeFeatureState = createFeatureSelector<GnroTreeState<unknown>>(featureKey);

  const selectTreeConfig = createSelector(selectTreeFeatureState, (state) =>
    state ? state.treeConfig : defaultTreeState().treeConfig,
  );

  const selectTreeData = createSelector(selectTreeFeatureState, (state) => (state ? state.treeData : []));

  const selectTreeInMemoryData = createSelector(selectTreeFeatureState, (state) => (state ? state.inMemoryData : []));

  const selectRowSelection = createSelector(selectTreeFeatureState, (state) => (state ? state.selection : undefined));

  const selectors: TreeSelectors = {
    selectTreeConfig,
    selectTreeData,
    selectTreeInMemoryData,
    selectRowSelection,
  };

  treeSelectorsByFeature.set(gridName, selectors);
  return selectors;
}
