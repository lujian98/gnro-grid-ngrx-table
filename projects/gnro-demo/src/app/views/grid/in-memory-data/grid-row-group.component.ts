import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, GnroColumnConfig, defaultGridConfig, GnroGridData } from '@gnro/ui/grid';
import { CARSDATA3 } from '../../../data/cars-large';

@Component({
  selector: 'app-grid-row-group',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig" [gridData]="gridData"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridRowGroupComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    horizontalScroll: true,
    columnSticky: true,
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
    rowSelection: true,
    multiRowSelection: true,
    rowGroup: true,
    rowGroupField: {
      field: 'brand',
      dir: 'desc',
    },
    virtualScroll: true,
    remoteColumnsConfig: false,
    remoteGridData: false,
  };

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
      sticky: true,
      groupField: false,
    },
    {
      name: 'vin',
      width: 350,
      groupField: false,
    },
    {
      name: 'brand',
      width: 350,
    },
    {
      name: 'year',
      width: 350,
      align: 'right',
    },
    {
      name: 'color',
      width: 80,
      stickyEnd: true,
      align: 'center',
    },
  ];
  gridData: GnroGridData<any> = CARSDATA3;
}
