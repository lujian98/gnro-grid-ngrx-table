import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Options, GnroD3Component } from '@gnro/ui/d3';
import * as d3TimeFormat from 'd3-time-format';

@Component({
  selector: 'app-cpi-chart',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <gnro-d3 [chartConfigs]="chartConfigs1" [data]="cpiYearToYearData"></gnro-d3>
    <gnro-d3 [chartConfigs]="chartConfigs2" [data]="cpiMonthToMonthData"></gnro-d3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppCPIChartComponent implements OnInit {
  cpiYearToYearData: any = null;
  chartConfigs1: GnroD3ChartConfig[] = [
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
        verticalBrushShow: false,
      },
    },
  ];

  cpiMonthToMonthData: any[] = [];
  chartConfigs2: GnroD3ChartConfig[] = [
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
        verticalBrushShow: false,
      },
    },
  ];

  minYear = new Date('2021-01-01');
  ngOnInit(): void {
    const keys = ['CPI', 'CPI Monthly Average', 'CPI Actual', 'Core CPI', 'PCE', 'Core PCE']; // , 'Core CPI', 'PCE', 'Core PCE'

    this.cpiYearToYearData = this.cpiMonthToMonthData = keys.map((k) => ({
      key: k,
      values: [],
    }));

    fetch('./assets/data/cpi-year-over-year-data.json')
      .then((res) => res.json())
      .then((data) => {
        //console.log( ' ffffff json data=', data)
        this.cpiYearToYearData = keys.map((k) => ({
          key: k,
          values: this.get_key_values(k, data),
        }));
        window.dispatchEvent(new Event('resize'));
      });

    fetch('./assets/data/cpi-month-over-month-data.json')
      .then((res) => res.json())
      .then((data) => {
        this.cpiMonthToMonthData = keys.map((k) => ({
          key: k,
          values: this.get_key_values(k, data),
        }));
        window.dispatchEvent(new Event('resize'));
      });
  }

  private get_key_values(key: string, values: any): any[] {
    return values
      .filter((data: any) => data[key] !== undefined && new Date(data.date) >= this.minYear)
      .map((data: any) => ({
        date: new Date(data.date),
        value: data[key],
      }));
  }
}
