import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-remote-row-group',
  template: `<gnro-grid [gridConfig]="gridConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridRemoteRowGroupComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    //horizontalScroll: true,
    //columnSticky: true,
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
    rowSelection: true,
    multiRowSelection: true,
    rowGroup: true,
    virtualScroll: true,
    remoteColumnsConfig: true,
    remoteGridData: true,
    rowGroupField: {
      field: 'year',
      dir: 'desc',
    },
  };
}
