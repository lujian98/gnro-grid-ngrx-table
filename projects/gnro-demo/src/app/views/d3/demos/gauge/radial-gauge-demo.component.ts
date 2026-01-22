import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3ChartConfig, GnroD3Options, GnroD3Component, defaultD3Config } from '@gnro/ui/d3';

@Component({
  selector: 'app-radial-gauge-demo',
  styles: [':host { width: 100%; height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <div style="height: 100%; display: flex;">
      <gnro-d3 [d3Config]="d3config" [chartConfigs]="chartConfigs" [data]="data"></gnro-d3>
      <gnro-d3 [d3Config]="d3config2" [chartConfigs]="chartConfigs2" [data]="data2"></gnro-d3>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroD3Component],
})
export class AppRadialGaugeDemoComponent implements OnInit {
  d3config = {
    ...defaultD3Config,
    chartName: 'radial-gauge',
  };

  d3config2 = {
    ...defaultD3Config,
    chartName: 'radial-gauge-2',
  };

  chartConfigs: GnroD3ChartConfig[] = [
    {
      chartType: 'radialGauge',
      x: (d: any) => d.label,
      y: (d: any) => d.value,
      radialGauge: {
        valueUnit: 'kW',
        range: [
          {
            value: 0,
          },
          {
            value: 1,
          },
          {
            value: 2,
          },
          {
            value: 3,
          },
          {
            value: 4,
          },
          {
            value: 5.0,
          },
          {
            value: 6.0,
          },
        ],
      },
    },
  ];

  chartConfigs2: GnroD3ChartConfig[] = [
    {
      chartType: 'radialGauge',
      // y0: (d: any) => d.values,
      y: (d: any) => d,
      radialGauge: {
        startAngle: Math.PI * -0,
        endAngle: Math.PI * 2,
        majorGraduations: 12,
        centerOffsetY: 0,
        valueUnit: 'kW',
        range: [
          {
            value: 0,
            color: 'green',
          },
          {
            value: 2,
            color: 'rgb(156, 214, 130)',
          },
          {
            value: 4,
            color: '#8DCA2F',
          },
          {
            value: 6,
            color: '#FDC702',
          },
          {
            value: 8,
            color: '#FF7700',
          },
          {
            value: 10.0,
            color: '#C50200',
          },
          {
            value: 12.0,
            color: 'red',
          },
        ],
      },
    },
  ];

  data!: any[];

  data2!: any[];

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.data = [
      {
        values: [{ label: 'A', value: 3 }],
      },
    ];
    let v = 3.0;
    this.data2 = [
      {
        values: [v],
      },
    ];

    setInterval(() => {
      v += 0.05;
      if (v > 12) {
        v = 0;
      }
      this.data2 = [
        {
          values: [v],
        },
      ];
      this.cd.detectChanges();
    }, 500);

    setInterval(() => {
      this.data = [
        {
          values: [
            { label: 'A', value: Math.floor(Math.random() * 70) / 10 },
            { label: 'B', value: Math.floor(Math.random() * 70) / 10 },
            { label: 'C', value: Math.floor(Math.random() * 70) / 10 },
          ],
        },
      ];
      this.cd.detectChanges();
    }, 1000);
  }
}
