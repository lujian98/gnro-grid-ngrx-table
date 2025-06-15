import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Options, IccD3Component, defaultD3Config } from '@icc/ui/d3';
import * as d3Format from 'd3-format';
import { POPULATION } from '../../data/population2';

@Component({
  selector: 'app-stacked-horizontal-bar-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex;}'],
  template: ` <icc-d3 [chartConfigs]="chartConfigs" [data]="data"></icc-d3> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppStackedNormalizedHorizontalBarDemoComponent implements OnInit {
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'stackedNormalizedHorizontalBarChart',
      xScaleType: 'linear',
      yScaleType: 'band',
      x0: (d: any) => d.label,
      y0: (d: any) => d.values,
      x: (d: any) => d.value,
      y: (d: any) => d.name,
      drawColor: (d: any, i: any) => d.label,
      popover: {
        valueFormatter: (d: any) => d3Format.format(',.0f')(d),
      },
      zoom: {
        enabled: true,
        horizontalOff: true,
        horizontalBrushShow: true,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
  ];

  data: any;

  ngOnInit(): void {
    this.data = this.formatData(POPULATION);
  }

  private formatData(data: any[]): any[] {
    const keys = ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '\u226580'];
    const ndata: any[] = [];
    keys.forEach((d: any) => {
      ndata.push({
        label: d,
        values: [],
      });
    });
    data.forEach((d, i) => {
      keys.forEach((key, j) => {
        const t = {
          name: d.name,
          value: d[key],
        };
        ndata[j].values.push(t);
      });
    });
    return ndata;
  }
}
