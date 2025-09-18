import { GnroOnAction } from '@gnro/ui/core';
import { getSelection, initSelection, setSelection } from '@gnro/ui/grid';
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
import { treeActions } from './tree.actions';

const initialState = <T>(): TreeState<T> => ({});

export const gnroTreeOnActions: GnroOnAction<TreeState<unknown>>[] = [
  on(treeActions.initConfig, (state, action) => {
    const treeConfig = { ...action.treeConfig };
    const key = action.treeId;
    const newState = { ...state };
    const defaultSelection = state[key] ? state[key].selection.selection : defaultTreeState().selection.selection;
    const selection = initSelection(treeConfig, defaultSelection);
    newState[key] = {
      ...defaultTreeState(),
      treeConfig,
      treeSetting: {
        // not used in the tree panel yet, just hold for the gridId
        ...defaultTreeState().treeSetting,
        gridId: action.treeId,
      },
      selection: getSelection(treeConfig, selection, []),
    };
    return { ...newState };
  }),

  on(treeActions.getDataSuccess, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      const oldState = state[key];
      const inMemoryData = gnroSetNestNodeId([...action.treeData]);
      const treeData = gnroFlattenTree([...inMemoryData], 0);
      setSelection(oldState.treeConfig, oldState.selection.selection, treeData);
      newState[key] = {
        ...oldState,
        inMemoryData,
        treeData,
        selection: getSelection(oldState.treeConfig, oldState.selection.selection, oldState.treeData),
      };
    }
    return { ...newState };
  }),

  on(treeActions.setInMemoryData, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      newState[key] = {
        ...state[key],
        inMemoryData: gnroSetNestNodeId([...action.treeData]),
      };
    }
    return { ...newState };
  }),

  on(treeActions.getInMemoryDataSuccess, (state, action) => {
    const key = action.treeId;
    const newState = { ...state }; // treeData is faltten and filter
    if (state[key]) {
      const oldState = state[key];
      setSelection(oldState.treeConfig, oldState.selection.selection, action.treeData);
      newState[key] = {
        ...oldState,
        treeData: [...action.treeData],
        selection: getSelection(oldState.treeConfig, oldState.selection.selection, action.treeData),
      };
    }
    return { ...newState };
  }),

  on(treeActions.nodeToggleInMemoryData, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
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
    const newState = { ...state };
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
    const newState = { ...state };
    if (state[key]) {
      const oldState = state[key];
      setSelection(oldState.treeConfig, oldState.selection.selection, oldState.treeData);
      newState[key] = {
        ...oldState,
        inMemoryData: gnroExpandAllNodesInMemoryData(oldState.inMemoryData, action.expanded),
        selection: getSelection(oldState.treeConfig, oldState.selection.selection, oldState.treeData),
      };
    }
    return { ...newState };
  }),

  on(treeActions.setSelectAllRows, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      const oldState = state[key];
      const selection = oldState.selection.selection;
      if (action.selectAll) {
        oldState.treeData.forEach((record) => selection.select(record));
      } else {
        selection.clear();
      }
      newState[key] = {
        ...oldState,
        selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
      };
    }
    return { ...newState };
  }),
  on(treeActions.setSelectRows, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      const oldState = state[key];
      const selection = oldState.selection.selection;
      action.records.forEach((record) => {
        if (action.isSelected) {
          selection.select(record);
        } else {
          selection.deselect(record);
        }
      });
      newState[key] = {
        ...oldState,
        selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
      };
    }
    return { ...newState };
  }),
  on(treeActions.setSelectRow, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      const oldState = state[key];
      const selection = oldState.selection.selection;
      selection.clear();
      selection.select(action.record);
      newState[key] = {
        ...oldState,
        selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
      };
    }
    return { ...newState };
  }),

  on(treeActions.removeStore, (state, action) => {
    const key = action.treeId;
    const newState = { ...state };
    if (state[key]) {
      delete newState[key];
    }
    return { ...newState };
  }),
];

export const gnroTreeReducer = createReducer(initialState(), ...gnroTreeOnActions);
export const gnroTreeFeature = createFeature({ name: 'gnroTree', reducer: gnroTreeReducer });
