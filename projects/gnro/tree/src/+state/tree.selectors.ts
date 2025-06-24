import { SelectionModel } from '@angular/cdk/collections';
import { createSelector } from '@ngrx/store';
import { TreeState } from '../models/tree-grid.model';

export interface AppTreeState {
  gnroTree: TreeState;
}

export const featureSelector = (state: AppTreeState) => state.gnroTree;

export const selectTreeData = (treeId: string) =>
  createSelector(featureSelector, (state: TreeState) => {
    return state && state[treeId] ? state[treeId].treeData : [];
  });

export const selectTreeInMemoryData = (treeId: string) =>
  createSelector(featureSelector, (state: TreeState) => {
    return state && state[treeId] ? state[treeId].inMemoryData : [];
  });

export const selectRowSelection = (treeId: string) =>
  createSelector(featureSelector, (state: TreeState) => {
    return state && state[treeId] ? state[treeId].selection : new SelectionModel<object>(false, []);
  });

export const selectRowSelections = (treeId: string) =>
  createSelector(featureSelector, (state: TreeState) => {
    if (state && state[treeId]) {
      const oldState = state[treeId];
      const selection = oldState.selection;
      //const dataCounts = oldState.data.filter((item) => item && !(item instanceof GnroRowGroup)).length;
      const dataCounts = oldState.treeData.filter((item) => item).length;
      const allSelected = selection.selected.length === dataCounts && dataCounts > 0;
      return {
        selection,
        allSelected,
        indeterminate: selection.hasValue() && !allSelected,
      };
    } else {
      return {
        selection: new SelectionModel<object>(false, []),
        allSelected: false,
        indeterminate: false,
      };
    }
  });
