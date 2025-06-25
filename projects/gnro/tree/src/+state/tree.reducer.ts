import { createFeature, createReducer, on } from '@ngrx/store';
import { SelectionModel } from '@angular/cdk/collections';
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
import { allRowSelected, getSelection } from '@gnro/ui/grid';

export const initialState: TreeState = {};

export const gnroTreeFeature = createFeature({
  name: 'gnroTree',
  reducer: createReducer(
    initialState,
    on(treeActions.initTreeConfig, (state, action) => {
      const treeConfig = { ...action.treeConfig };
      const key = action.treeId;
      const newState: TreeState = { ...state };
      console.log(' qqqqqqqqqqqq treeConfig=', treeConfig);
      const initSelection = state[key] ? state[key].selection.selection : defaultTreeState.selection.selection;
      const selection = treeConfig.multiRowSelection ? new SelectionModel<object>(true, []) : initSelection;

      newState[key] = {
        ...defaultTreeState,
        treeConfig,
        treeSetting: {
          // not used in the tree panel yet, just hold for the gridId
          ...defaultTreeState.treeSetting,
          gridId: action.treeId,
        },
        selection: getSelection(treeConfig, selection, state[key].treeData),
        //selection: treeConfig.multiRowSelection ? new SelectionModel<object>(true, []) : selection,
      };
      return { ...newState };
    }),
    //  selection: gridConfig.multiRowSelection ? new SelectionModel<object>(true, []) : state[key].selection,

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

    on(treeActions.setSelectAllRows, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection.selection;
        let selected = 0;
        console.log(' 00000 oldState.treeData=', oldState.treeData);
        if (action.selectAll) {
          // const selectedRecords = oldState.treeData.filter((item) => item);
          oldState.treeData.forEach((record) => selection.select(record));
          selected = oldState.treeData.length;
        } else {
          selection.clear();
        }
        console.log(' 11111 selected =', selected);
        newState[key] = {
          ...oldState,
          treeSetting: {
            ...state[key].treeSetting,
            //selected,
            //allRowSelected: allRowSelected(selection, oldState.treeData),
          },
          selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
        };
      }
      //console.log(' aall selection =', newState[key].selection);
      //console.log(' aall selectioned =', newState[key].treeSetting.allRowSelected);
      return { ...newState };
    }),
    on(treeActions.setSelectRows, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
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
        const allselected = allRowSelected(selection, oldState.treeData);
        console.log(' allselected =', allselected);
        newState[key] = {
          ...oldState,
          treeSetting: {
            ...state[key].treeSetting,
            //selected: action.selected,
            //allRowSelected: allRowSelected(selection, oldState.treeData),
          },
          selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
        };
      }
      return { ...newState };
    }),
    on(treeActions.setSelectRow, (state, action) => {
      const key = action.treeId;
      const newState: TreeState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection.selection;
        selection.clear();
        selection.select(action.record);
        newState[key] = {
          ...oldState,
          treeSetting: {
            ...state[key].treeSetting,
            //selected: 1,
            //allRowSelected: allRowSelected(selection, oldState.treeData),
          },
          selection: getSelection(oldState.treeConfig, selection, oldState.treeData),
        };
      }
      //console.log(' sssssssss newState =', newState);
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
