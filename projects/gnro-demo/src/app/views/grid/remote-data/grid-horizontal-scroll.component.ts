import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-horizontal-scroll',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridHorizontalScrollComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    horizontalScroll: true,
    rowSelection: true,
    multiRowSelection: true,
    columnResize: true,
    columnMenu: true,
    columnSort: true,
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
      width: 450,
    },
    {
      name: 'brand',
      width: 150,
    },
    {
      name: 'year',
      width: 350,
      align: 'right',
    },
    {
      name: 'color',
      width: 750,
      align: 'center',
    },
  ];
}
