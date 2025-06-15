import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccColumnConfig } from '@icc/ui/grid';
import { IccTreeComponent, IccTreeNode, defaultTreeConfig, IccTreeConfig } from '@icc/ui/tree';
import { CAR_TREE_DATA } from './data/tree-large-data';

interface NestedFoodNode extends IccTreeNode<NestedFoodNode> {
  name: string;
  vin?: string;
  year?: string;
  children?: NestedFoodNode[];
}

const NESTED_DATA: NestedFoodNode[] = [
  {
    name: 'Fruit',
    vin: 'aaa',
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

@Component({
  selector: 'app-tree-remote-config',
  template: `<icc-tree [treeConfig]="treeConfig" [columnsConfig]="columnsConfig" [treeData]="treeData"></icc-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTreeComponent],
})
export class AppTreeRemoteConfigComponent {
  treeConfig: IccTreeConfig = {
    ...defaultTreeConfig,
    urlKey: 'RND',
    remoteGridConfig: true,
  };

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

  treeData = CAR_TREE_DATA;
}
