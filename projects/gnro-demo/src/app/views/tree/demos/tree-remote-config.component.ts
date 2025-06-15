import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig } from '@gnro/ui/grid';
import { GnroTreeComponent, GnroTreeNode, defaultTreeConfig, GnroTreeConfig } from '@gnro/ui/tree';
import { CAR_TREE_DATA } from './data/tree-large-data';

interface NestedFoodNode extends GnroTreeNode<NestedFoodNode> {
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
  template: `<gnro-tree [treeConfig]="treeConfig" [columnsConfig]="columnsConfig" [treeData]="treeData"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppTreeRemoteConfigComponent {
  treeConfig: GnroTreeConfig = {
    ...defaultTreeConfig,
    urlKey: 'RND',
    remoteGridConfig: true,
  };

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

  treeData = CAR_TREE_DATA;
}
