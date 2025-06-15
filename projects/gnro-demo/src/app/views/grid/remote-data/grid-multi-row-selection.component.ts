import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccColumnConfig, IccGridConfig, IccGridComponent, defaultGridConfig } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-multi-row-selection',
  template: `<icc-grid [gridConfig]="gridConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; padding: 0 0px }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridMultiRowSelectionComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    rowSelection: true,
    columnMenu: true,
    columnSort: true,
    columnFilter: true,
    columnHidden: true,
    columnResize: true,
    columnReorder: true,
    multiRowSelection: true,
    recordKey: 'ID',
    remoteColumnsConfig: true,
    remoteGridData: true,
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
}
