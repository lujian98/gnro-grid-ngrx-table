import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTreeComponent, GnroTreeNode, defaultTreeConfig, GnroTreeConfig } from '@gnro/ui/tree';

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
  selector: 'app-tree-remote-config-column',
  template: `<gnro-tree [treeConfig]="treeConfig" [treeData]="treeData"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppTreeRemoteConfigColumnComponent {
  treeConfig: GnroTreeConfig = {
    ...defaultTreeConfig,
    gridName: 'MET',
    remoteGridConfig: true,
  };

  treeData: GnroTreeNode<NestedFoodNode>[] = NESTED_DATA;
}
