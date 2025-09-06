import { createActionGroup, props } from '@ngrx/store';
import { GnroTreeConfig, GnroTreeData } from '../models/tree-grid.model';

export const treeActions = createActionGroup({
  source: '[Tree]',
  events: {
    'Init Config': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
    'Get Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
    'Get Concat Tree Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
    'Get Data Success': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
    'Set InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
    'Get InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
    'Get InMemory Data Success': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
    'Node Toggle InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; node: GnroTreeData }>(),
    'Expand All Nodes InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; expanded: boolean }>(),
    'Drop Node': props<{
      treeId: string;
      treeConfig: GnroTreeConfig;
      node: GnroTreeData;
      targetParent: GnroTreeData;
      targetIndex: number;
    }>(),
    'Set Select All Rows': props<{ treeId: string; selectAll: boolean }>(),
    'Set Select Rows': props<{ treeId: string; records: object[]; isSelected: boolean; selected: number }>(),
    'Set Select Row': props<{ treeId: string; record: object }>(),
    'Clear Store': props<{ treeId: string }>(),
    'Remove Store': props<{ treeId: string }>(),
  },
});

/*
export const initTreeConfig = createAction(
  '[Tree] Init Tree Config',
  props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
);
export const getTreeRemoteData = createAction(
  '[Tree] Get Tree Data',
  props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
);
export const getConcatTreeData = createAction(
  '[Tree] Get Concat Tree Data',
  props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
);
export const getTreeRemoteDataSuccess = createAction(
  '[Tree] Get Tree Remote Data Success',
  props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
);
export const setTreeInMemoryData = createAction(
  '[Tree] Get Tree In Memory Data',
  props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
);
export const getTreeInMemoryData = createAction(
  '[Tree] Get Tree InMemoryData Data',
  props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
);
export const getInMemoryTreeDataSuccess = createAction(
  '[Tree] Get Tree InMemory Data Success',
  props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeData[] }>(),
);

export const nodeToggleInMemoryData = createAction(
  '[Tree] Node Toggle InMemoryData',
  props<{ treeId: string; treeConfig: GnroTreeConfig; node: GnroTreeData }>(),
);

export const expandAllNodesInMemoryData = createAction(
  '[Tree] Expand All Nodes InMemoryData',
  props<{ treeId: string; treeConfig: GnroTreeConfig; expanded: boolean }>(),
);
export const dropNode = createAction(
  '[Tree] Node Toggle dropNode',
  props<{
    treeId: string;
    treeConfig: GnroTreeConfig;
    node: GnroTreeData;
    targetParent: GnroTreeData;
    targetIndex: number;
  }>(),
);
export const setSelectAllRows = createAction(
  '[Tree] Setup Tree Set Select or Unselect All Rows',
  props<{ treeId: string; selectAll: boolean }>(),
);
export const setSelectRows = createAction(
  '[Tree] Setup Tree Set Select or Unselect Rows',
  props<{ treeId: string; records: object[]; isSelected: boolean; selected: number }>(),
);
export const setSelectRow = createAction(
  '[Tree] Setup Tree Set Select a Row and clear all other rows',
  props<{ treeId: string; record: object }>(),
);

export const clearTreeDataStore = createAction('[Tree] Clear Tree Data Store', props<{ treeId: string }>());
export const removeTreeDataStore = createAction('[Tree] Remove Tree Data Store', props<{ treeId: string }>());

*/
