import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Options, GnroD3BulletChartData, GnroD3Component, defaultD3Config } from '@gnro/ui/d3';

import * as d3TimeFormat from 'd3-time-format';

@Component({
  selector: 'd3-bullet-chart-demo',
  styles: [':host {width: 100%;  display: flex; flex-direction: column;}'],
  template: `
    <gnro-d3 [d3Config]="d3Config" [chartConfigs]="chartConfigs" [data]="data" style="height: 200px"></gnro-d3>
    <gnro-d3 [d3Config]="d3Config2" [chartConfigs]="chartConfigs2" [data]="data2" style="height: 260px"></gnro-d3>
    <gnro-d3 [d3Config]="d3Config3" [chartConfigs]="chartConfigs3" [data]="data3" style="height: 200px"></gnro-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppBulletChartDemoComponent implements OnInit {
  options: GnroD3Options = {
    margin: { left: 100 },
  };

  d3Config = {
    ...defaultD3Config,
    chartName: 'bullet-chart',
    options: { ...this.options },
  };

  chartConfigs: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      x: (d: any) => d.x,
      // margin: { left: 100 },
      yAxis: {
        axisLabel: 'Power (kw)',
        // textAnchor: 'end',
        axisLabelDistance: -40,
        rotate: 0,
      },
    },
  ];

  options2: GnroD3Options = {
    margin: { left: 120 },
  };

  d3Config2 = {
    ...defaultD3Config,
    chartName: 'bullet-chart-2',
    options: { ...this.options2 },
  };

  chartConfigs2: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      x: (d: any) => d.x,
      //
      bullet: {
        markerLineWidth: 4,
      },
      yAxis: {
        axisLabel: 'Temperature (F)',
        textAnchor: 'end',
        axisLabelDistance: -10,
        rotate: 0,
      },
    },
  ];

  options3: GnroD3Options = {
    margin: { left: 120, bottom: 50 },
  };
  d3Config3 = {
    ...defaultD3Config,
    chartName: 'bullet-chart-3',
    options: { ...this.options3 },
  };

  chartConfigs3: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      // x: (d: any) => d.value,
      // margin: { left: 120, bottom: 50 },
      bullet: {
        markerLineWidth: 8,
      },
      yAxis: {
        axisLabel: 'Temperature (F)',
        textAnchor: 'end',
        axisLabelDistance: -10,
        rotate: 0,
      },

      xAxis: {
        axisLabel: 'Temperature (F)',
      },
    },
  ];

  data: GnroD3BulletChartData[] = [
    {
      range: [
        {
          label: 'Group A',
          color: 'red',
          value: 200,
        },
        {
          label: 'Group B',
          color: 'red',
          value: 3000,
        },
        {
          label: 'Group B',
          color: 'orange',
          value: 2400,
        },
        {
          label: 'Group I',
          color: 'green',
          value: 2000,
        },
      ],
      measures: [
        {
          name: 'Group B',
          color: 'deepskyblue',
          x: 2500,
        },
        {
          name: 'Group C',
          color: 'dodgerblue',
          x: 2150,
        },
        {
          name: 'Group B',
          color: 'steelblue',
          x: 1450,
        },
        {
          name: 'Group B',
          color: 'royalblue',
          x: 1000,
        },
        {
          name: 'Group I',
          color: 'blue',
          x: 500,
        },
      ],
      markerLines: [
        { x: 1000, color: 'red' },
        { x: 1750, color: 'orange' },
        { x: 2300, color: 'black' },
      ],
    },
  ];

  data2: GnroD3BulletChartData[] = [
    {
      range: [
        {
          label: 'Group A',
          color: 'red',
          value: 40,
        },
        {
          label: 'Group B',
          color: 'red',
          value: 260,
        },
        {
          label: 'Group B',
          color: 'orange',
          value: 240,
        },
        {
          label: 'Group I',
          color: 'green',
          value: 200,
        },
      ],
      measures: [
        {
          name: 'Group B',
          color: 'lightskyblue',
          x: 250,
        },
        {
          name: 'Group B',
          color: 'dodgerblue',
          x: 215,
        },
        {
          name: 'Group B',
          color: 'blue',
          x: 140,
        },
        {
          name: 'Group B',
          color: 'steelblue',
          x: 142,
        },
        {
          name: 'Group I',
          color: 'deepskyblue',
          x: 146,
        },
      ],
      markerLines: [
        { x: 100, color: 'red' },
        { x: 175, color: 'orange' },
        { x: 230, color: 'black' },
      ],
    },
  ];

  data3: GnroD3BulletChartData[] = [
    {
      range: [
        {
          label: 'Group A',
          value: 40,
        },
        {
          label: 'Group B',
          color: '#eee',
          value: 260,
        },
        {
          label: 'Group B',
          color: '#ddd',
          value: 240,
        },
        {
          label: 'Group I',
          color: '#ccc',
          value: 200,
        },
      ],
      measures: [
        {
          name: 'Group B',
          color: 'red',
          value: 250,
        },
        {
          name: 'Group B',
          color: 'blue',
          value: 215,
        },
        {
          name: 'Group B',
          color: 'lightsteelblue',
          value: 180,
        },
        {
          name: 'Group B',
          color: 'orange',
          value: 182,
        },
        {
          name: 'Group I',
          color: 'steelblue',
          value: 120,
        },
      ],
      markerLines: [
        { value: 100, color: 'green' },
        { value: 175, color: 'orange' },
        { value: 230, color: 'blue' },
      ],
    },
  ];

  ngOnInit() {}
}
