import { createSelector } from '@ngrx/store';
import { TreeState } from '../models/tree-grid.model';

export interface AppTreeState<T> {
  gnroTree: TreeState<T>;
}

export const featureSelector = <T>(state: AppTreeState<T>) => state.gnroTree;

export const selectTreeData = (treeId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[treeId] ? state[treeId].treeData : [];
  });

export const selectTreeInMemoryData = (treeId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[treeId] ? state[treeId].inMemoryData : [];
  });

export const selectRowSelection = (treeId: string) =>
  createSelector(featureSelector, (state) => {
    return state && state[treeId] ? state[treeId].selection : undefined;
  });
