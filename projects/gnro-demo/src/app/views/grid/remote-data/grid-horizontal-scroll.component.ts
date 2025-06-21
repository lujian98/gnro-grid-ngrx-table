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
    columnSticky: true,
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
      width: 80,
      align: 'center',
      sticky: true,
    },
    {
      name: 'vin',
      width: 450,
      //sticky: true,
    },
    {
      name: 'brand',
      width: 450,
    },
    {
      name: 'year',
      width: 550,
      align: 'right',
    },
    {
      name: 'color',
      width: 150,
      align: 'center',
      stickyEnd: true,
    },
  ];
}
