import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccTreeComponent, defaultTreeConfig, IccTreeConfig } from '@icc/ui/tree';

@Component({
  selector: 'app-tree-remote-column-data',
  template: `<icc-tree [treeConfig]="treeConfig"></icc-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTreeComponent],
})
export class AppTreeRemoteColumnDataComponent {
  treeConfig: IccTreeConfig = {
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
