import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccGridConfig, IccGridComponent, defaultGridConfig } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-remote-row-group',
  template: `<icc-grid [gridConfig]="gridConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridRemoteRowGroupComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
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
