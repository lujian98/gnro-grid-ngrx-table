import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccColumnConfig, IccGridConfig, IccGridComponent, defaultGridConfig } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-horizontal-scroll',
  template: `<icc-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridHorizontalScrollComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    horizontalScroll: true,
    columnResize: true,
    columnMenu: true,
    columnSort: true,
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
