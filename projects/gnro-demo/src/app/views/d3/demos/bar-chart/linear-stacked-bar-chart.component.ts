import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Options, IccD3Component } from '@icc/ui/d3';
import * as d3Array from 'd3-array';

@Component({
  selector: 'app-linear-stacked-bar-chart',
  styles: [':host {width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <icc-d3 [chartConfigs]="chartConfigs" [data]="data"></icc-d3>
    <icc-d3 [chartConfigs]="chartConfigs2" [data]="data"></icc-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppLinearStackedBarChartComponent implements OnInit {
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'stackedBarChart',
      xScaleType: 'linear',
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      x: (d: any) => d.x,
      y: (d: any) => d.y,
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: true,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
  ];

  chartConfigs2: IccD3ChartConfig[] = [
    {
      chartType: 'groupedBarChart',
      xScaleType: 'band',
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      x: (d: any) => d.x,
      y: (d: any) => d.y,
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: true,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
  ];

  data!: any[];
  ngOnInit() {
    this.data = this.getData();
    console.log(' data =', this.data);
  }

  private getData() {
    return this.stream_layers(3, 10 + Math.random() * 10, 0.1).map((data, i) => {
      return { key: 'Stream' + i, values: data };
    });
  }

  stream_layers(n: any, m: any, o: any) {
    if (arguments.length < 3) {
      o = 0;
    }
    return d3Array.range(n).map(() => {
      const a = [];
      for (let i = 0; i < m; i++) {
        a[i] = o + o * Math.random();
      }
      for (let i = 0; i < 5; i++) {
        this.bump(a, m);
      }
      return a.map((d, index) => {
        return { x: index, y: Math.max(0, d) };
      });
    });
  }

  private bump(a: any, m: any) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
}
