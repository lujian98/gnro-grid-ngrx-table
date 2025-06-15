import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Component } from '@gnro/ui/d3';

@Component({
  selector: 'app-pie-chart-demo',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <div style="height: 100%; display: flex;">
      <gnro-d3 [chartConfigs]="chartConfigs" [data]="data"></gnro-d3>
      <gnro-d3 [chartConfigs]="chartConfigs2" [data]="data2"></gnro-d3>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppPieChartDemoComponent implements OnInit {
  chartConfigs: GnroD3ChartConfig[] = [
    {
      chartType: 'pieChart',
      xScaleType: 'band',
      axisEnabled: true,
      x: (d: any) => d.key,
      y: (d: any) => d.y,
      drawColor: (d: any, i: any) => d.key,
      legend: {
        position: 'top',
      },
    },
  ];

  chartConfigs2: GnroD3ChartConfig[] = [
    {
      chartType: 'pieChart',
      xScaleType: 'band',
      axisEnabled: true,
      x: (d: any) => d.key,
      y: (d: any) => d.y,
      drawColor: (d: any, i: any) => d.key,
      legend: {
        position: 'right',
        align: 'center',
      },
      pie: {
        startAngle: (Math.PI * -1) / 2,
        endAngle: (Math.PI * 1) / 2,
      },
    },
  ];

  data0 = [
    {
      key: 'One',
      y: 1,
    },
    {
      key: 'Two',
      y: 2,
    },
    {
      key: 'Three',
      y: 3,
    },
    {
      key: 'Four',
      y: 4,
    },

    {
      key: 'Five',
      y: 5,
    },
    {
      key: 'Six',
      y: 6,
    },
    {
      key: 'Seven',
      y: 7,
    },
  ];

  data!: any[];
  data2!: any[];

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.data = [...this.data0];
    this.data2 = [...this.data0];

    /*
    const ndata = [...this.data0];
    setInterval(() => {
      const adata = [...ndata].map((d: any) => {
        const t = { ...d };
        t.y = 1 + Math.floor(Math.random() * 10);
        return t;
      });
      this.data = [
        ...adata
      ];
      this.data2 = [
        ...adata
      ];
    }, 3000);
    */
  }
}
