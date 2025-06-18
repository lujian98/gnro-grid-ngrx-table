import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-column-resize',
  template: `<gnro-grid [gridConfig]="gridConfig" [columnsConfig]="columnsConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridColumnResizeComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    columnResize: true,
    remoteGridData: true,
  };

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 20,
      align: 'center',
    },
    {
      name: 'vin',
    },
    {
      name: 'brand',
      resizeable: false,
      width: 75,
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
