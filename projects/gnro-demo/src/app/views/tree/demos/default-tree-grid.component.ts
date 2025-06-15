import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccColumnConfig } from '@icc/ui/grid';
import { IccTreeComponent, IccTreeNode } from '@icc/ui/tree';

interface NestedFoodNode extends IccTreeNode<NestedFoodNode> {
  name: string;
  vin?: string;
  year?: string;
  children?: NestedFoodNode[];
}

const NESTED_DATA: NestedFoodNode[] = [
  {
    name: 'Fruit',
    icon: 'bell',
    vin: 'aaa',
    children: [{ name: 'Apple', icon: 'bell' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    icon: 'bell',
    expanded: true,
    children: [
      {
        name: 'Green',
        expanded: true,
        icon: 'bell',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts', icon: 'bell' }],
      },
      {
        name: 'Orange',
        icon: 'bell',
        year: '1990',
        expanded: false,
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'app-default-tree-grid',
  template: `<icc-tree [columnsConfig]="columnsConfig" [treeData]="treeData"></icc-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTreeComponent],
})
export class AppDefaultTreeGridComponent {
  columnsConfig: IccColumnConfig[] = [
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
  treeData: IccTreeNode<NestedFoodNode>[] = NESTED_DATA;
}
