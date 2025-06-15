import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Component } from '@icc/ui/d3';
import * as d3Format from 'd3-format';

@Component({
  selector: 'app-donut-chart-demo',
  styles: [':host { width: 1000px; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <div style="height: 100%; display: flex;">
      <icc-d3 style="width: 600px;" [chartConfigs]="chartConfigs" [data]="data"></icc-d3>
      <icc-d3 style="width: 600px;" [chartConfigs]="chartConfigs2" [data]="data2"></icc-d3>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppDonutChartDemoComponent implements OnInit {
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'pieChart',
      xScaleType: 'band',
      axisEnabled: false,
      x: (d: any) => d.name,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.name,
      legend: {
        position: 'top',
      },
      pie: {
        donut: 0.66,
        startAngle: Math.PI * 0.5,
        endAngle: Math.PI * -1.0,
      },
    },
  ];

  chartConfigs2: IccD3ChartConfig[] = [
    {
      chartType: 'pieChart',
      xScaleType: 'band',
      axisEnabled: false,
      x: (d: any) => d.name,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.name,
      legend: {
        position: 'right',
        align: 'center',
      },
      popover: {
        valueFormatter: (d: any) => d3Format.format(',.0f')(d),
      },
      pie: {
        donut: 0.5,
      },
    },
  ];

  data = [
    { name: '<5', value: 19912018 },
    { name: '5-9', value: 20501982 },
    { name: '10-14', value: 20679786 },
    { name: '15-19', value: 21354481 },
    { name: '20-24', value: 22604232 },
    { name: '25-29', value: 21698010 },
    { name: '30-34', value: 21183639 },
    { name: '35-39', value: 19855782 },
    { name: '40-44', value: 20796128 },
    { name: '45-49', value: 21370368 },
    { name: '50-54', value: 22525490 },
    { name: '55-59', value: 21001947 },
    { name: '60-64', value: 18415681 },
    { name: '65-69', value: 14547446 },
    { name: '70-74', value: 10587721 },
    { name: '75-79', value: 7730129 },
    { name: '80-84', value: 5811429 },
    { name: '≥85', value: 5938752 },
  ];

  data2!: any[];

  ngOnInit(): void {
    this.data2 = [...this.data];
  }
}
