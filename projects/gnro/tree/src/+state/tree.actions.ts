import { createAction, props } from '@ngrx/store';
import { GnroTreeConfig, GnroTreeData } from '../models/tree-grid.model';

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

export const clearTreeDataStore = createAction('[Tree] Clear Tree Data Store', props<{ treeId: string }>());
export const removeTreeDataStore = createAction('[Tree] Remove Tree Data Store', props<{ treeId: string }>());
