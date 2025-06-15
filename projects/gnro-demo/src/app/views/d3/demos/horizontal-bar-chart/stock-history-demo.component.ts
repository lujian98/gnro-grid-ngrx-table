import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IccD3ChartConfig, IccDrawServie, IccD3Options, IccD3Component, defaultD3Config } from '@icc/ui/d3';
import { AppDrawServie } from './draw/draw-service';
import { STOCK_PRICE } from '../../data/stock_price';

@Component({
  selector: 'app-stock-history-demo',
  styles: [':host {width: 100%; height: 100%; display: flex;}'],
  template: ` <icc-d3 [d3Config]="d3Config" [chartConfigs]="chartConfigs" [data]="data"></icc-d3> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccD3Component],
  providers: [
    {
      provide: IccDrawServie,
      useClass: AppDrawServie,
    },
  ],
})
export class AppStockHistoryDemoComponent<T> implements OnInit {
  options: IccD3Options = {
    margin: { right: 60, left: 80 },
  };
  d3Config = {
    ...defaultD3Config,
    options: { ...this.options },
  };

  chartConfigs: IccD3ChartConfig[] = [
    {
      chartType: 'horizontalBarChart',
      xScaleType: 'linear',
      yScaleType: 'band',
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      x: (d: any) => d.value,
      y: (d: any) => d.name,
      barColor: (d: any, i: any) => d.name,
    },
  ];

  data!: any[];

  @ViewChild(IccD3Component) iccd!: IccD3Component<T>;

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit() {
    const ndata = STOCK_PRICE;
    let k = 0;
    setInterval(() => {
      const vdata = ndata[k];
      if (vdata && k <= 100) {
        const newData = {
          ...vdata,
          values: vdata.values.filter((v: any, i: any) => i < 12),
        };
        //vdata.values = vdata.values.filter((v: any, i: any) => i < 12);
        this.data = [newData];
        this.cd.detectChanges();
        k++;
      }
    }, 550);
  }
}
