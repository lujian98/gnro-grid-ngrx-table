import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccGridConfig, IccGridComponent, defaultGridConfig } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-overall',
  template: `<icc-grid [gridConfig]="gridConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridOverallComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
    remoteColumnsConfig: true,
    remoteGridData: true,

    sortFields: [
      {
        field: 'ID',
        dir: 'desc',
      },
    ],
    columnFilters: [{ name: 'vin', value: '9' }],
    rowSelection: true,
  };
}
