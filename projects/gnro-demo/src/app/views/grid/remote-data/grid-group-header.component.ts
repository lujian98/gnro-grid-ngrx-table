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
    horizontalScroll: true,
    columnSticky: true,
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
      width: 80,
      //sticky: true,
      align: 'center',
    },
    {
      name: 'vin',
      width: 330,
      //sticky: true,
      groupHeader: this.vehicleGroupHeader,
    },
    {
      name: 'brand',
      width: 430,
      //sticky: true,
      groupHeader: this.vehicleGroupHeader,
    },
    {
      name: 'Price',
      width: 130,
      //sticky: true,
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
      width: 230,
      align: 'right',
      //stickyEnd: true,
      groupHeader: this.valueGroupHeader,
    },
    {
      name: 'color',
      width: 150,
      align: 'center',
      //stickyEnd: true,
      groupHeader: this.valueGroupHeader,
    },
    {
      name: 'MakerColor',
      align: 'center',
      //stickyEnd: true,
      groupHeader: this.valueGroupHeader,
      rendererType: GnroObjectType.Select,
      rendererFieldConfig: {
        optionKey: 'name',
        optionLabel: 'title',
      },
      width: 230,
    },
  ];
}
