import { getSelection, initSelection, setSelection } from '@gnro/ui/grid';
import { Action, createReducer, on } from '@ngrx/store';
import { GnroTreeState, defaultTreeState } from '../models/tree-grid.model';
import {
  gnroAddNestedTreeNode,
  gnroExpandAllNodesInMemoryData,
  gnroFlattenTree,
  gnroNodeToggleInMemoryData,
  gnroRemoveNestedNode,
  gnroSetNestNodeId,
} from '../utils/nested-tree';
import { treeActions } from './tree.actions';

// Generate feature key based on gridName
export function getTreeFeatureKey(gridName: string): string {
  return `tree-${gridName}`;
}

// Get initial state for a specific tree
export function getInitialTreeState<T>(gridName: string): GnroTreeState<T> {
  return {
    ...defaultTreeState<T>(),
    treeSetting: {
      ...defaultTreeState<T>().treeSetting,
      gridId: gridName,
    },
  };
}

// Cache for reducers by gridName
const treeReducersByFeature = new Map<
  string,
  (state: GnroTreeState<unknown> | undefined, action: Action) => GnroTreeState<unknown>
>();

// Factory function to create per-gridName reducers
export function createTreeReducerForFeature(gridName: string) {
  const cached = treeReducersByFeature.get(gridName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialTreeState<unknown>(gridName);

  const treeReducer = createReducer(
    initialState,
    on(treeActions.initConfig, (state, action) => {
      if (action.gridName !== gridName) return state;
      const treeConfig = { ...action.treeConfig };
      // Set urlKey to gridName if urlKey is empty
      const urlKey = treeConfig.urlKey || treeConfig.gridName;
      // Always start from fresh initial state
      const freshState = getInitialTreeState<unknown>(gridName);
      const selection = initSelection(treeConfig, freshState.selection.selection);
      return {
        ...freshState,
        treeConfig: {
          ...treeConfig,
          urlKey,
        },
        treeSetting: {
          ...freshState.treeSetting,
          gridId: gridName,
        },
        selection: getSelection(treeConfig, selection, []),
      };
    }),

    on(treeActions.getDataSuccess, (state, action) => {
      if (action.gridName !== gridName) return state;
      const inMemoryData = gnroSetNestNodeId([...action.treeData]);
      const treeData = gnroFlattenTree([...inMemoryData], 0);
      setSelection(state.treeConfig, state.selection.selection, treeData);
      return {
        ...state,
        inMemoryData,
        treeData,
        selection: getSelection(state.treeConfig, state.selection.selection, state.treeData),
      };
    }),

    on(treeActions.setInMemoryData, (state, action) => {
      if (action.gridName !== gridName) return state;
      return {
        ...state,
        inMemoryData: gnroSetNestNodeId([...action.treeData]),
      };
    }),

    on(treeActions.getInMemoryDataSuccess, (state, action) => {
      if (action.gridName !== gridName) return state;
      setSelection(state.treeConfig, state.selection.selection, action.treeData);
      return {
        ...state,
        treeData: [...action.treeData],
        selection: getSelection(state.treeConfig, state.selection.selection, action.treeData),
      };
    }),

    on(treeActions.nodeToggleInMemoryData, (state, action) => {
      if (action.gridName !== gridName) return state;
      return {
        ...state,
        inMemoryData: gnroNodeToggleInMemoryData(state.inMemoryData, action.node),
      };
    }),

    on(treeActions.dropNode, (state, action) => {
      if (action.gridName !== gridName) return state;
      const nodes = gnroRemoveNestedNode([...state.inMemoryData], action.node);
      const inMemoryData = gnroAddNestedTreeNode([...nodes], action.node, action.targetParent, action.targetIndex);
      return {
        ...state,
        inMemoryData,
      };
    }),

    on(treeActions.expandAllNodesInMemoryData, (state, action) => {
      if (action.gridName !== gridName) return state;
      setSelection(state.treeConfig, state.selection.selection, state.treeData);
      return {
        ...state,
        inMemoryData: gnroExpandAllNodesInMemoryData(state.inMemoryData, action.expanded),
        selection: getSelection(state.treeConfig, state.selection.selection, state.treeData),
      };
    }),

    on(treeActions.setSelectAllRows, (state, action) => {
      if (action.gridName !== gridName) return state;
      const selection = state.selection.selection;
      if (action.selectAll) {
        state.treeData.forEach((record) => selection.select(record));
      } else {
        selection.clear();
      }
      return {
        ...state,
        selection: getSelection(state.treeConfig, selection, state.treeData),
      };
    }),

    on(treeActions.setSelectRows, (state, action) => {
      if (action.gridName !== gridName) return state;
      const selection = state.selection.selection;
      action.records.forEach((record) => {
        if (action.isSelected) {
          selection.select(record);
        } else {
          selection.deselect(record);
        }
      });
      return {
        ...state,
        selection: getSelection(state.treeConfig, selection, state.treeData),
      };
    }),

    on(treeActions.setSelectRow, (state, action) => {
      if (action.gridName !== gridName) return state;
      const selection = state.selection.selection;
      selection.clear();
      selection.select(action.record);
      return {
        ...state,
        selection: getSelection(state.treeConfig, selection, state.treeData),
      };
    }),

    on(treeActions.removeStore, (state, action) => {
      if (action.gridName !== gridName) return state;
      return getInitialTreeState<unknown>(gridName);
    }),
  );

  const reducerFn = (state: GnroTreeState<unknown> | undefined, action: Action): GnroTreeState<unknown> => {
    return treeReducer(state, action);
  };

  treeReducersByFeature.set(gridName, reducerFn);
  return reducerFn;
}
