import { createActionGroup, props } from '@ngrx/store';
import { GnroTreeConfig, GnroTreeNode } from '../models/tree-grid.model';

export const treeActions = createTreeActions();

function createTreeActions<T>() {
  return createActionGroup({
    source: 'Tree',
    events: {
      'Init Config': props<{ gridName: string; treeConfig: GnroTreeConfig }>(),
      'Get Data': props<{ gridName: string; treeConfig: GnroTreeConfig }>(),
      'Get Concat Tree Data': props<{ gridName: string; treeConfig: GnroTreeConfig }>(),
      'Get Data Success': props<{ gridName: string; treeConfig: GnroTreeConfig; treeData: GnroTreeNode<T>[] }>(),
      'Set InMemory Data': props<{ gridName: string; treeConfig: GnroTreeConfig; treeData: GnroTreeNode<T>[] }>(),
      'Get InMemory Data': props<{ gridName: string; treeConfig: GnroTreeConfig }>(),
      'Get InMemory Data Success': props<{
        gridName: string;
        treeConfig: GnroTreeConfig;
        treeData: GnroTreeNode<T>[];
      }>(),
      'Node Toggle InMemory Data': props<{ gridName: string; treeConfig: GnroTreeConfig; node: GnroTreeNode<T> }>(),
      'Expand All Nodes InMemory Data': props<{ gridName: string; treeConfig: GnroTreeConfig; expanded: boolean }>(),
      'Drop Node': props<{
        gridName: string;
        treeConfig: GnroTreeConfig;
        node: GnroTreeNode<T>;
        targetParent: GnroTreeNode<T>;
        targetIndex: number;
      }>(),
      'Set Select All Rows': props<{ gridName: string; selectAll: boolean }>(),
      'Set Select Rows': props<{
        gridName: string;
        records: GnroTreeNode<T>[];
        isSelected: boolean;
        selected: number;
      }>(),
      'Set Select Row': props<{ gridName: string; record: GnroTreeNode<T> }>(),
      'Clear Store': props<{ gridName: string }>(),
      'Remove Store': props<{ gridName: string }>(),
    },
  });
}
