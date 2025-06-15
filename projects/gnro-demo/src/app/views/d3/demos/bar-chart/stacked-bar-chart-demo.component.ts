import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Options, IccD3Component, defaultD3Config } from '@icc/ui/d3';
import { SAMPLE_DATA, SAMPLE_DATA1 } from '../../data';

@Component({
  selector: 'app-stacked-bar-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <icc-d3 [d3Config]="d3Config" [chartConfigs]="chartConfigs" [data]="data"></icc-d3>
    <icc-d3 [chartConfigs]="chartConfigs2" [data]="data"></icc-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppStackedBarChartDemoComponent implements OnInit {
  data = SAMPLE_DATA;

  options: IccD3Options = {
    margin: { right: 50, left: 60 },
  };
  d3Config = {
    ...defaultD3Config,
    options: { ...this.options },
  };

  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'stackedBarChart',
      xScaleType: 'band',

      x0: (d: any) => d.label,
      y0: (d: any) => d.values,
      x: (d: any) => d.State,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.label,
      colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'],
    },
  ];

  chartConfigs2: IccD3ChartConfig[] = [
    {
      chartType: 'stackedNormalizedBarChart',
      xScaleType: 'band',
      x0: (d: any) => d.label,
      y0: (d: any) => d.values,
      x: (d: any) => d.State,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.label,
      colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'],
      legend: {
        align: 'left',
      },
    },
  ];

  ngOnInit() {
    this.data = this.formatData(this.data);
    console.log(' this.data =', this.data);
  }

  private formatData(data: any[]) {
    const keys = [
      'Under 5 Years',
      '5 to 13 Years',
      '14 to 17 Years',
      '18 to 24 Years',
      '25 to 44 Years',
      '45 to 64 Years',
      '65 Years and Over',
    ];
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
          State: d.State,
          value: d[key],
        };
        ndata[j].values.push(t);
      });
    });

    console.log(' ndata =', ndata);
    return ndata;
  }
}
