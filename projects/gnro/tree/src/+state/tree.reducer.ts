import { createFeature, createReducer, on } from '@ngrx/store';
import { TreeState, defaultTreeState } from '../models/tree-grid.model';
import {
  gnroAddNestedTreeNode,
  gnroExpandAllNodesInMemoryData,
  gnroFlattenTree,
  gnroNodeToggleInMemoryData,
  gnroRemoveNestedNode,
  gnroSetNestNodeId,
} from '../utils/nested-tree';
import * as treeActions from './tree.actions';

export const initialState: TreeState = {};

export const gnroTreeFeature = createFeature({
  name: 'gnroTree',
  reducer: createReducer(
    initialState,
    on(treeActions.initTreeConfig, (state, action) => {
      const treeConfig = { ...action.treeConfig };
      const key = action.treeId;
      const newState: TreeState = { ...state };
      newState[key] = {
        ...defaultTreeState,
        treeConfig,
        treeSetting: {
          // not used in the tree panel yet, just hold for the gridId
          ...defaultTreeState.treeSetting,
          gridId: action.treeId,
        },
      };
      return { ...newState };
    }),

    on(treeActions.getTreeRemoteDataSuccess, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const inMemoryData = gnroSetNestNodeId([...action.treeData]);
        newState[key] = {
          ...oldState,
          inMemoryData,
          treeData: gnroFlattenTree([...inMemoryData], 0),
        };
      }
      return { ...newState };
    }),

    on(treeActions.setTreeInMemoryData, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          inMemoryData: gnroSetNestNodeId([...action.treeData]),
        };
      }
      return { ...newState };
    }),

    on(treeActions.getInMemoryTreeDataSuccess, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state }; // treeData is faltten and filter
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          treeData: [...action.treeData],
        };
      }
      return { ...newState };
    }),

    on(treeActions.nodeToggleInMemoryData, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          inMemoryData: gnroNodeToggleInMemoryData(oldState.inMemoryData, action.node),
        };
      }
      return { ...newState };
    }),

    on(treeActions.dropNode, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const nodes = gnroRemoveNestedNode([...oldState.inMemoryData], action.node);
        const inMemoryData = gnroAddNestedTreeNode([...nodes], action.node, action.targetParent, action.targetIndex);
        newState[key] = {
          ...oldState,
          inMemoryData,
        };
      }
      return { ...newState };
    }),

    on(treeActions.expandAllNodesInMemoryData, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          inMemoryData: gnroExpandAllNodesInMemoryData(oldState.inMemoryData, action.expanded),
        };
      }
      return { ...newState };
    }),

    on(treeActions.removeTreeDataStore, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
