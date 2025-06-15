import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Component } from '@icc/ui/d3';
import * as d3Format from 'd3-format';
import { STATISTICS } from '../../data';

@Component({
  selector: 'app-bar-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex;}'],
  template: `
    <icc-d3 [chartConfigs]="chartConfigs" [data]="data"></icc-d3>
    <icc-d3 [chartConfigs]="chartConfigs2" [data]="data3"></icc-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppBarChartDemoComponent implements OnInit {
  data: any;
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'barChart',
      xScaleType: 'band',
      x0: (d: any) => d.label,
      y0: (d: any) => d.values,
      x: (d: any) => d.letter,
      y: (d: any) => d.frequency,
      useInteractiveGuideline: true,
      duration: 2000,
      popover: {
        valueFormatter: (d: any) => d3Format.format(',.3f')(d),
      },
    },
  ];

  chartConfigs2: IccD3ChartConfig[] = [
    {
      chartType: 'barChart',
      xScaleType: 'band',
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      x: (d: any) => d.label,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.label,
      // useInteractiveGuideline: true,
      duration: 2000,
    },
  ];

  data3 = [
    {
      key: 'Cumulative Return',
      color: 'cyan',
      values: [
        {
          label: 'A',
          color: 'blue',
          value: 59.765957771107,
        },
        {
          label: 'B',
          color: 'green',
          value: 30,
        },
        {
          label: 'C',
          color: 'orange',
          value: 32.807804682612,
        },
        {
          label: 'D',
          color: 'red',
          value: 196.45946739256,
        },
        {
          label: 'E',
          value: -39.434030906893,
        },
        {
          label: 'F',
          value: 98.079782601442,
        },
        {
          label: 'G',
          value: -33.925743130903,
        },
        {
          label: 'H',
          value: 25.1387322875705,
        },
      ],
    },
  ];

  ngOnInit() {
    const data = [
      {
        label: 'Frequency',
        chartType: 'lineChart',
        color: 'blue',
        values: STATISTICS,
      },
      {
        label: 'Frequency',
        chartType: 'barChart',
        color: 'green',
        values: STATISTICS,
      },
    ];
    this.data = data;
  }
}
