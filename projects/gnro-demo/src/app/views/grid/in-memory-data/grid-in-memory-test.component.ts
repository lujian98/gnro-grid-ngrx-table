import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccGridConfig, IccGridComponent, IccColumnConfig, defaultGridConfig, IccGridData } from '@icc/ui/grid';
import { CARSDATA3 } from '../../../data/cars-large';

@Component({
  selector: 'app-grid-in-memory-test',
  template: `<icc-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig" [gridData]="gridData"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridinMemoryTestComponent {
  gridConfig: IccGridConfig = {
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

  columnsConfig: IccColumnConfig[] = [
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
  gridData: IccGridData<any> = CARSDATA3;
}
