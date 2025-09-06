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
