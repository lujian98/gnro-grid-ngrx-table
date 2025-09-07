import { createActionGroup, props } from '@ngrx/store';
import { GnroTreeConfig, GnroTreeNode } from '../models/tree-grid.model';

export const treeActions = createTreeActions();

export function createTreeActions<T>() {
  return createActionGroup({
    source: '[Tree]',
    events: {
      'Init Config': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
      'Get Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
      'Get Concat Tree Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
      'Get Data Success': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeNode<T>[] }>(),
      'Set InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeNode<T>[] }>(),
      'Get InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig }>(),
      'Get InMemory Data Success': props<{ treeId: string; treeConfig: GnroTreeConfig; treeData: GnroTreeNode<T>[] }>(),
      'Node Toggle InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; node: GnroTreeNode<T> }>(),
      'Expand All Nodes InMemory Data': props<{ treeId: string; treeConfig: GnroTreeConfig; expanded: boolean }>(),
      'Drop Node': props<{
        treeId: string;
        treeConfig: GnroTreeConfig;
        node: GnroTreeNode<T>;
        targetParent: GnroTreeNode<T>;
        targetIndex: number;
      }>(),
      'Set Select All Rows': props<{ treeId: string; selectAll: boolean }>(),
      'Set Select Rows': props<{ treeId: string; records: GnroTreeNode<T>[]; isSelected: boolean; selected: number }>(),
      'Set Select Row': props<{ treeId: string; record: GnroTreeNode<T> }>(),
      'Clear Store': props<{ treeId: string }>(),
      'Remove Store': props<{ treeId: string }>(),
    },
  });
}
