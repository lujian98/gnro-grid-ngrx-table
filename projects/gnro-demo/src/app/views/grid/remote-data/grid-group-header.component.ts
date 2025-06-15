import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccColumnConfig, IccGridConfig, IccGridComponent, defaultGridConfig, IccGroupHeader } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-group-header',
  template: `<icc-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridGroupHeaderComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    rowSelection: true,
    multiRowSelection: true,
    columnMenu: true,
    columnSort: true,
    columnHidden: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    groupHeader: true,
    remoteGridData: true,
  };

  private vehicleGroupHeader: IccGroupHeader = {
    name: 'vehiclegroup',
    title: 'Vehicle Information',
  };
  private valueGroupHeader: IccGroupHeader = {
    name: 'valuegroup',
    title: 'Value Information',
  };

  columnsConfig: IccColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
    },
    {
      name: 'vin',
      groupHeader: this.vehicleGroupHeader,
    },
    {
      name: 'brand',
      groupHeader: this.vehicleGroupHeader,
    },
    {
      name: 'year',
      width: 50,
      align: 'right',
      groupHeader: this.valueGroupHeader,
    },
    {
      name: 'color',
      width: 80,
      align: 'center',
      groupHeader: this.valueGroupHeader,
    },
  ];
}
