import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Options, GnroD3BulletChartData, GnroD3Component, defaultD3Config } from '@gnro/ui/d3';
import * as d3TimeFormat from 'd3-time-format';

@Component({
  selector: 'd3-vertical-bullet-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex; flex-direction: row;}'],
  template: `
    <div style="height: 100%; display: flex; flex-direction: column;">
      <gnro-d3 [d3Config]="d3Config" [chartConfigs]="chartConfigs" [data]="data" style="width: 90px"></gnro-d3>
    </div>
    <div style="height: 100%; display: flex; flex-direction: column;">
      <gnro-d3 [d3Config]="d3Config2" [chartConfigs]="chartConfigs2" [data]="data2" style="width: 140px"></gnro-d3>
    </div>
    <div style="height: 100%; display: flex; flex-direction: column;">
      <gnro-d3 [d3Config]="d3Config3" [chartConfigs]="chartConfigs3" [data]="data3" style="width: 140px"></gnro-d3>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppVerticalBulletChartDemoComponent implements OnInit {
  options: GnroD3Options = {
    // margin: { left: 60 },
  };
  d3Config = {
    ...defaultD3Config,
    //options: { ...this.options },
  };

  chartConfigs: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      bullet: {
        type: 'vertical',
      },
      y: (d: any) => d.x,
      xAxis: {
        axisLabel: 'Power (kw)',
        textAnchor: 'end',
        axisLabelDistance: 20,
      },
    },
  ];

  options2: GnroD3Options = {
    margin: { left: 90 },
  };
  d3Config2 = {
    ...defaultD3Config,
    options: { ...this.options2 },
  };

  chartConfigs2: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      bullet: {
        type: 'vertical',
        markerLineWidth: 4,
      },
      // margin: { left: 90 },
      y: (d: any) => d.x,
      xAxis: {
        axisLabel: 'Temperature (F)',
        textAnchor: 'end',
        axisLabelDistance: 20,
      },
      yAxis: {
        axisLabel: 'Temperature (F)',
      },
    },
  ];

  options3: GnroD3Options = {
    margin: { left: 90 },
  };
  d3Config3 = {
    ...defaultD3Config,
    options: { ...this.options3 },
  };

  chartConfigs3: GnroD3ChartConfig[] = [
    {
      chartType: 'bulletChart',
      // x: (d: any) => d.value,
      bullet: {
        type: 'vertical',
        markerLineWidth: 8,
      },
      // margin: { left: 90 },
      xAxis: {
        axisLabel: 'Temperature (F)',
        textAnchor: 'end',
        axisLabelDistance: 20,
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
