import { GnroGridConfig, defaultGridConfig, GnroGridSetting, defaultGridSetting } from '@gnro/ui/grid';

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

export interface GnroTreeNode<T> extends GnroTreeData {}

export interface TreeState {
  [key: string]: GnroTreeState;
}

export interface GnroTreeState<T extends object = object> {
  treeConfig: GnroTreeConfig;
  treeSetting: GnroTreeSetting;
  treeData: GnroTreeNode<T>[];
  inMemoryData: GnroTreeNode<T>[];
}

export const defaultTreeState: GnroTreeState = {
  treeConfig: defaultTreeConfig,
  treeSetting: defaultTreeSetting,
  treeData: [],
  inMemoryData: [],
};

export interface GnroTreeDropInfo<T> {
  target: GnroTreeNode<T>;
  targetParent?: GnroTreeNode<T>;
  targetIndex?: number;
  position?: string;
}
