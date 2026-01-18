import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig } from '@gnro/ui/grid';
import { GnroTreeComponent, defaultTreeConfig, GnroTreeConfig } from '@gnro/ui/tree';

@Component({
  selector: 'app-tree-remote-data',
  template: `<gnro-tree [treeConfig]="treeConfig" [columnsConfig]="columnsConfig"></gnro-tree>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTreeComponent],
})
export class AppTreeRemoteDataComponent {
  treeConfig: GnroTreeConfig = {
    ...defaultTreeConfig,
    gridName: 'ECR',
    remoteGridData: true,
    remoteLoadAll: true,

    columnSort: true,
    columnFilter: true,
    columnResize: true,
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
}
