import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-filter',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridFilterComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    columnFilter: true,
    columnFilters: [{ name: 'vin', value: '9' }],
    remoteGridData: true,
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
      filterField: false,
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
