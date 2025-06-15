import { GnroTreeNode, GnroTreeConfig } from '@gnro/ui/tree';
import { GnroColumnConfig } from '@gnro/ui/grid';

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

export const ECRTreeGridConfig: Partial<GnroTreeConfig> = {
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

export const ECRColumnConfig: GnroColumnConfig[] = [
  {
    name: 'name',
    width: 50,
    align: 'left',
  },
  {
    name: 'vin',
  },
  {
    name: 'brand',
  },
  {
    name: 'year',
    width: 50,
    align: 'right',
  },
  {
    name: 'color',
    width: 80,
    align: 'center',
  },
];

export const NPRTreeGridConfig: Partial<GnroTreeConfig> = {
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

export const METTreeGridConfig: Partial<GnroTreeConfig> = {
  remoteGridData: false,
  remoteColumnsConfig: true,
};

export const RNDTreeGridConfig: Partial<GnroTreeConfig> = {
  remoteGridData: false,
  remoteColumnsConfig: false,
  columnSort: true,
  columnFilter: true,
  columnResize: true,
  columnReorder: true,
  columnMenu: true,
  columnHidden: true,
};
