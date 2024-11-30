import { IccTreeNode } from '@icc/ui/tree';
import { IccColumnConfig } from '@icc/ui/grid';

export interface NestedFoodNode extends IccTreeNode<NestedFoodNode> {
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

export const ECRColumnConfig: IccColumnConfig[] = [
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
