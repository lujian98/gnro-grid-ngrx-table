import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-multi-row-selection',
  template: `<gnro-grid [gridConfig]="gridConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; padding: 0 0px }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridMultiRowSelectionComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCRMS',
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
