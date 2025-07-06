import { GnroTreeNode, GnroTreeConfig } from '@gnro/ui/tree';
import { GnroColumnConfig, GnroGridConfigResponse, GnroColumnConfigResponse } from '@gnro/ui/grid';

export interface NestedFoodNode extends GnroTreeNode<NestedFoodNode> {
  name: string;
  vin?: string;
  year?: string;
  children?: NestedFoodNode[];
}

export const TREE_NESTED_DATA: NestedFoodNode[] = [
  {
    name: 'Fruit',
    vin: 'aaa',
    expanded: false,
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    expanded: true,
    children: [
      {
        name: 'Green',
        expanded: true,
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        year: '1990',
        expanded: false,
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

export const ECRTreeGridConfigData: Partial<GnroTreeConfig> = {
  remoteGridData: true,
  remoteColumnsConfig: true,
  remoteLoadAll: true,
  columnSort: true,
  columnFilter: true,
  columnResize: true,
  columnReorder: true,
  columnMenu: true,
  columnHidden: true,
};

export const ECRTreeGridConfig: GnroGridConfigResponse = {
  gridConfig: ECRTreeGridConfigData,
};

export const ECRColumnConfigData: GnroColumnConfig[] = [
  {
    name: 'name',
    width: 150,
    align: 'left',
  },
  {
    name: 'vin',
    width: 450,
  },
  {
    name: 'brand',
    width: 350,
  },
  {
    name: 'year',
    width: 350,
    align: 'right',
  },
  {
    name: 'color',
    width: 80,
    align: 'center',
  },
];

export const ECRColumnConfig: GnroColumnConfigResponse = {
  columnConfigs: ECRColumnConfigData,
};

export const NPRTreeGridConfigData: Partial<GnroTreeConfig> = {
  remoteGridData: true,
  //remoteColumnsConfig: true,
  remoteLoadAll: true,
  columnSort: true,
  columnFilter: true,
  columnResize: true,
  columnReorder: true,
  columnMenu: true,
  columnHidden: true,
};

export const NPRTreeGridConfig: GnroGridConfigResponse = {
  gridConfig: NPRTreeGridConfigData,
};

export const METTreeGridConfigData: Partial<GnroTreeConfig> = {
  remoteGridData: false,
  remoteColumnsConfig: true,
};

export const METTreeGridConfig: GnroGridConfigResponse = {
  gridConfig: METTreeGridConfigData,
};

export const RNDTreeGridConfigData: Partial<GnroTreeConfig> = {
  remoteGridData: false,
  remoteColumnsConfig: false,
  columnSort: true,
  columnFilter: true,
  columnResize: true,
  columnReorder: true,
  columnMenu: true,
  columnHidden: true,
};

export const RNDTreeGridConfig: GnroGridConfigResponse = {
  gridConfig: RNDTreeGridConfigData,
};
