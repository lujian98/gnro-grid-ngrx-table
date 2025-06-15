import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig, GnroGroupHeader } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-group-header',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridGroupHeaderComponent {
  gridConfig: GnroGridConfig = {
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

  private vehicleGroupHeader: GnroGroupHeader = {
    name: 'vehiclegroup',
    title: 'Vehicle Information',
  };
  private valueGroupHeader: GnroGroupHeader = {
    name: 'valuegroup',
    title: 'Value Information',
  };

  columnsConfig: GnroColumnConfig[] = [
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
