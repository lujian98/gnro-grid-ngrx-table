import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Options, GnroD3Component, defaultD3Config } from '@gnro/ui/d3';
import { SAMPLE_DATA, SAMPLE_DATA1 } from '../../data';

@Component({
  selector: 'app-stacked-bar-chart-demo',
  styles: [':host {width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <gnro-d3 [d3Config]="d3Config" [chartConfigs]="chartConfigs" [data]="data"></gnro-d3>
    <gnro-d3 [d3Config]="d3Config2" [chartConfigs]="chartConfigs2" [data]="data"></gnro-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppStackedBarChartDemoComponent implements OnInit {
  data = SAMPLE_DATA;

  options: GnroD3Options = {
    margin: { right: 50, left: 60 },
  };
  d3Config = {
    ...defaultD3Config,
    chartName: 'stacked-bar-chart',
    options: { ...this.options },
  };
  d3Config2 = {
    ...defaultD3Config,
    chartName: 'stacked-bar-chart-2',
    options: { ...this.options },
  };

  chartConfigs: GnroD3ChartConfig[] = [
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

  chartConfigs2: GnroD3ChartConfig[] = [
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
