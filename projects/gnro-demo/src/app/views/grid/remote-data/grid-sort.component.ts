import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-sort',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridSortComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    columnSort: true,
    sortFields: [
      {
        field: 'brand',
        dir: 'desc',
      },
    ],
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
