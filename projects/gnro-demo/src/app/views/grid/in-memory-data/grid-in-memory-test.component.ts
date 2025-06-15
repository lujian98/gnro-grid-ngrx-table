import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, GnroColumnConfig, defaultGridConfig, GnroGridData } from '@gnro/ui/grid';
import { CARSDATA3 } from '../../../data/cars-large';

@Component({
  selector: 'app-grid-in-memory-test',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig" [gridData]="gridData"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridinMemoryTestComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
    rowSelection: true,
    sortFields: [
      {
        field: 'brand',
        dir: 'desc',
      },
    ],
    columnFilters: [{ name: 'vin', value: '9' }],
    remoteColumnsConfig: false,
    remoteGridData: false,
  };

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
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
  gridData: GnroGridData<any> = CARSDATA3;
}
