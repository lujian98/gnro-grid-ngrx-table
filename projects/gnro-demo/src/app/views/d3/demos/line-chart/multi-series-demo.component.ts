import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Component } from '@gnro/ui/d3';
import * as d3TimeFormat from 'd3-time-format';
import { TEMPERATURES } from '../../data';

@Component({
  selector: 'app-multi-series-demo',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <gnro-d3 [chartConfigs]="chartConfigs1" [data]="data"></gnro-d3>
    <gnro-d3 [chartConfigs]="chartConfigs2" [data]="data"></gnro-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppMultiSeriesDemoComponent implements OnInit {
  data = TEMPERATURES;
  chartConfigs1: GnroD3ChartConfig[] = [
    {
      chartType: 'lineChart',
      useInteractiveGuideline: true,
      x0: (d: any) => d.id,
      y0: (d: any) => d.values,
      x: (d: any) => d.date,
      y: (d: any) => d.temperature,
      drawColor: (d: any, i: any) => d.id,
      popover: {
        axisFormatter: (d: any) => d3TimeFormat.timeFormat('%x')(d),
      },
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: true,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
  ];

  data2: any;
  chartConfigs2: GnroD3ChartConfig[] = [
    {
      chartType: 'areaChart',
      useInteractiveGuideline: true,
      x0: (d: any) => d.id,
      y0: (d: any) => d.values,
      x: (d: any) => d.date,
      y: (d: any) => d.temperature,
      drawColor: (d: any, i: any) => d.id,
      popover: {
        axisFormatter: (d: any) => d3TimeFormat.timeFormat('%x')(d),
      },
    },
  ];

  ngOnInit() {}
}
