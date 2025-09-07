import { SelectionModel } from '@angular/cdk/collections';
import {
  GnroGridConfig,
  GnroGridSetting,
  defaultGridConfig,
  defaultGridSetting,
  GnroGridRowSelections,
} from '@gnro/ui/grid';

export interface GnroTreeConfig extends GnroGridConfig {
  remoteLoadAll?: boolean;
  dragDisabled?: boolean;
}

export interface GnroTreeSetting extends GnroGridSetting {}
export const defaultTreeSetting: GnroGridSetting = {
  ...defaultGridSetting,
  isTreeGrid: true,
};

export const defaultTreeConfig: GnroTreeConfig = {
  ...defaultGridConfig,
  virtualScroll: true,
  pageSize: 10000,
  remoteLoadAll: false,
  dragDisabled: false,
};

export interface GnroTreeData {
  id?: string; // if id not set will use name, must be unique tree node id to support drag and drop
  name: string;
  level?: number;
  leaf?: boolean;
  expanded?: boolean;
  icon?: string;
  children?: GnroTreeData[];
  //contextMenu?: GnroMenuConfig[];
}

export interface GnroTreeDataResponse {
  treeData: GnroTreeData[];
}

export interface GnroTreeNode<T> extends GnroTreeData {}

export interface TreeState<T> {
  [key: string]: GnroTreeState<T>;
}

export interface GnroTreeState<T> {
  treeConfig: GnroTreeConfig;
  treeSetting: GnroTreeSetting;
  treeData: GnroTreeNode<T>[];
  totalCounts: number;
  selection: GnroGridRowSelections<GnroTreeNode<T>>;
  inMemoryData: GnroTreeNode<T>[];
}

export function defaultTreeState<T>(): GnroTreeState<T> {
  return {
    treeConfig: defaultTreeConfig,
    treeSetting: defaultTreeSetting,
    treeData: [],
    totalCounts: 0,
    selection: {
      selection: new SelectionModel<GnroTreeNode<T>>(false, []),
      selected: 0,
      allSelected: false,
      indeterminate: false,
    },
    inMemoryData: [],
  };
}

export interface GnroTreeDropInfo<T> {
  target: GnroTreeNode<T>;
  targetParent?: GnroTreeNode<T>;
  targetIndex?: number;
  position?: string;
}
