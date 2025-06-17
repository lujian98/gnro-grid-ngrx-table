import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { sortByField, GnroObjectType } from '@gnro/ui/core';
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
      width: 30,
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
      name: 'Price',
      width: 30,
      groupHeader: this.vehicleGroupHeader,
      rendererType: GnroObjectType.Number,
      rendererFieldConfig: {
        decimals: 2,
      },
      filterField: GnroObjectType.Number,
      align: 'right',
    },
    {
      name: 'year',
      width: 30,
      align: 'right',
      groupHeader: this.valueGroupHeader,
    },
    {
      name: 'color',
      width: 50,
      align: 'center',
      groupHeader: this.valueGroupHeader,
    },
    {
      name: 'MakerColor',
      align: 'center',
      groupHeader: this.valueGroupHeader,
      rendererType: GnroObjectType.Select,
      rendererFieldConfig: {
        optionKey: 'name',
        optionLabel: 'title',
      },
      width: 30,
    },
  ];
}
