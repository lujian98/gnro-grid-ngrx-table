import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTreeComponent, defaultTreeConfig, GnroTreeConfig } from '@gnro/ui/tree';

@Component({
  selector: 'app-tree-remote-column-data',
  template: `<gnro-tree [treeConfig]="treeConfig"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppTreeRemoteColumnDataComponent {
  treeConfig: GnroTreeConfig = {
    ...defaultTreeConfig,
    urlKey: 'ECR',
    remoteGridData: true,
    remoteColumnsConfig: true,
    remoteLoadAll: true,

    columnSort: true,
    columnFilter: true,
    columnResize: true,
  };
}
