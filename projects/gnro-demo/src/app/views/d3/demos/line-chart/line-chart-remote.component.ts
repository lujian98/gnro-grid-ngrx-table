import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccD3Component, defaultD3Config } from '@icc/ui/d3';

@Component({
  selector: 'app-line-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <div style="height: 100%; display: flex;">
      <icc-d3 [d3Config]="d3Config1"></icc-d3>
      <icc-d3 [d3Config]="d3Config2"></icc-d3>
    </div>
    <div style="height: 100%; display: flex; margin-top: 20px;">
      <icc-d3 [d3Config]="d3Config3"></icc-d3>
      <icc-d3 [d3Config]="d3Config4"></icc-d3>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppLineChartRemoteComponent {
  d3Config1 = {
    ...defaultD3Config,
    urlKey: 'DCR',
    chartName: 'P1',
    remoteD3Config: true,
    remoteChartConfigs: true,
    remoteD3Data: true,
  };

  d3Config2 = {
    ...defaultD3Config,
    urlKey: 'DCR',
    chartName: 'P2',
    remoteD3Config: true,
    remoteChartConfigs: true,
    remoteD3Data: true,
  };

  d3Config3 = {
    ...defaultD3Config,
    urlKey: 'DCR',
    chartName: 'P3',
    remoteD3Config: true,
    remoteChartConfigs: true,
    remoteD3Data: true,
  };

  d3Config4 = {
    ...defaultD3Config,
    urlKey: 'DCR',
    chartName: 'P4',
    remoteD3Config: true,
    remoteChartConfigs: true,
    remoteD3Data: true,
  };
}
