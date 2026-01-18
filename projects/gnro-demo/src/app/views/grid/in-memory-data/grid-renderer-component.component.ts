import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroObjectType } from '@gnro/ui/core';
import {
  GnroColumnConfig,
  GnroGridConfig,
  GnroGridComponent,
  defaultGridConfig,
  GnroGridData,
  GnroGridCellRendererComponent,
} from '@gnro/ui/grid';
import { CARSDATA3 } from '../../../data/cars-large';

@Component({
  selector: 'app-grid-cell-text',
  template: `
    <div class="grid-cell">
      {{ cellValue }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppGridCellTextComponent extends GnroGridCellRendererComponent<string> {
  get cellValue(): string {
    const brand = (this.record as any)['brand'];
    const year = (this.record as any)['year'];
    return `${brand} ${year}`;
  }
}

@Component({
  selector: 'app-grid-renderer-component',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig" [gridData]="gridData"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridRendererComponent {
  gridConfig: Partial<GnroGridConfig> = {
    ...defaultGridConfig,
    gridName: 'DCR',
    rowHeight: 60,
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
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
      title: 'Make and Year',
      filterField: false,
      rendererType: GnroObjectType.Component,
      component: AppGridCellTextComponent,
    },
    {
      name: 'color',
      width: 80,
      align: 'center',
    },
    {
      name: 'image',
      width: 80,
      align: 'center',
      rendererType: GnroObjectType.Image,
    },
  ];
  gridData: GnroGridData<any> = CARSDATA3;
}
