import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Component } from '@icc/ui/d3';
import { SP500 } from '../../data';
import * as d3TimeFormat from 'd3-time-format';

interface Stock {
  date: Date;
  price: number;
}

@Component({
  selector: 'd3-demo-area-chart-demo',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <icc-d3 [chartConfigs]="chartConfigs" [data]="data"></icc-d3>
    <icc-d3 [chartConfigs]="chartConfigs2" [data]="data"></icc-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppAreaChartDemoComponent implements OnInit {
  data: any;
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'areaChart',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      x: (d: any) => d.date,
      y: (d: any) => d.price,
      drawColor: (d: any, i: any) => d.key,
      popover: {
        axisFormatter: (d: any) => d3TimeFormat.timeFormat('%x')(d),
      },
    },
  ];

  chartConfigs2: IccD3ChartConfig[] = [
    {
      chartType: 'lineChart',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      x: (d: any) => d.date,
      y: (d: any) => d.price,
      drawColor: (d: any, i: any) => d.key,
    },
  ];

  private parseDate = d3TimeFormat.timeParse('%b %Y');

  ngOnInit() {
    const data = [
      {
        key: 'SP500',
        // color: 'red',
        values: this.parseData(SP500),
      },
    ];
    this.data = data;
  }

  private parseData(data: any[]): any[] {
    return data.map((v) => {
      const ret = { date: this.parseDate(v.date), price: v.price };
      return ret;
    });
  }
}
