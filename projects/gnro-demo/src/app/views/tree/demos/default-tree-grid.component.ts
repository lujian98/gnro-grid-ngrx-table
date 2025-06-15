import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig } from '@gnro/ui/grid';
import { GnroTreeComponent, GnroTreeNode } from '@gnro/ui/tree';

interface NestedFoodNode extends GnroTreeNode<NestedFoodNode> {
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
  template: `<gnro-tree [columnsConfig]="columnsConfig" [treeData]="treeData"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppDefaultTreeGridComponent {
  columnsConfig: GnroColumnConfig[] = [
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
  treeData: GnroTreeNode<NestedFoodNode>[] = NESTED_DATA;
}
