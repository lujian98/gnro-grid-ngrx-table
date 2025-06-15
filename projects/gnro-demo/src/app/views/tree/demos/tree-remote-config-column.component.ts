import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccTreeComponent, IccTreeNode, defaultTreeConfig, IccTreeConfig } from '@icc/ui/tree';

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
  selector: 'app-tree-remote-config-column',
  template: `<icc-tree [treeConfig]="treeConfig" [treeData]="treeData"></icc-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTreeComponent],
})
export class AppTreeRemoteConfigColumnComponent {
  treeConfig: IccTreeConfig = {
    ...defaultTreeConfig,
    urlKey: 'MET',
    remoteGridConfig: true,
  };

  treeData: IccTreeNode<NestedFoodNode>[] = NESTED_DATA;
}
