import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IccD3ChartConfig, IccD3Options, IccD3Component } from '@icc/ui/d3';
import * as d3TimeFormat from 'd3-time-format';

@Component({
  selector: 'app-stock-chart',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: ` <icc-d3 [chartConfigs]="chartConfigs" [data]="stockData"></icc-d3> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
})
export class AppStockChartComponent implements OnInit {
  stockData: any[] = [];
  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'lineChart',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      x: (d: any) => d.date,
      y: (d: any) => d.value,
      drawColor: (d: any, i: any) => d.key,
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
    {
      chartType: 'lineChart',
      yAxisId: 'RIGHT',
      axisEnabled: true,
    },
  ];

  minYear = new Date('1980-01-01');
  ngOnInit(): void {
    this.stockData = [
      { key: 'SPY', values: [] },
      { key: 'FED Funds Rate', yAxisId: 'RIGHT', values: [] },
    ];

    fetch('./assets/data/spy-rate-data.json')
      .then((res) => res.json())
      .then((data) => {
        this.stockData = [
          {
            key: 'SPY',
            values: this.get_key_values('close', data),
          },
          {
            key: 'FED Funds Rate',
            yAxisId: 'RIGHT',
            values: this.get_key_values('FED Funds Rate', data),
          },
        ];
        console.log('this.stockData= ', this.stockData);
        window.dispatchEvent(new Event('resize'));
      });

    /*
    this.fedFundsRateData = [{ key: 'FED Funds Rate', values: [] }];
    this.stockData = [{ key: 'SPY', values: [] }];

    fetch('./assets/data/fed-funds-rate-data.json').then(res => res.json())
      .then(data => {
        this.fedFundsRateData = [{ key: 'FED Funds Rate', values: this.get_key_values('value', data) }];
      });

    fetch('./assets/data/stock-spy-data.json').then(res => res.json())
      .then(data => {
        this.stockData = [{ key: 'SPY', values: this.get_key_values('close', data) }];
      });
      */
  }

  private get_key_values(key: string, values: any): any[] {
    return values
      .filter(
        (data: any, i: number) => data[key] !== undefined && data[key] !== '' && new Date(data.date) >= this.minYear,
      )
      .map((data: any) => ({
        date: new Date(data.date),
        value: data[key],
      }));
  }
}
