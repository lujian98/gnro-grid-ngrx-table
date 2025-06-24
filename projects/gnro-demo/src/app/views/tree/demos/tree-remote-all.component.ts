import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTreeComponent, defaultTreeConfig, GnroTreeConfig } from '@gnro/ui/tree';

@Component({
  selector: 'app-tree-remote-all',
  template: `<gnro-tree [treeConfig]="treeConfig"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppTreeRemoteAllComponent {
  treeConfig: GnroTreeConfig = {
    ...defaultTreeConfig,
    urlKey: 'ECR',
    remoteGridConfig: true,
    horizontalScroll: true,
    columnSticky: true,
    rowSelection: true,
    multiRowSelection: true,
  };
}
