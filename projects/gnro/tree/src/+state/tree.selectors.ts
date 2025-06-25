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
    return state && state[treeId] ? state[treeId].selection : undefined;
  });
