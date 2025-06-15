import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IccAccordion, IccAccordionComponent } from '@icc/ui/accordion';
import { IccLayoutHorizontalComponent, IccLayoutLeftComponent, IccLayoutCenterComponent } from '@icc/ui/layout';
import { IccMenuConfig } from '@icc/ui/menu';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
    IccAccordionComponent,
  ],
})
export class AppD3Component {
  expendIndex = 0;
  items: IccAccordion[] = [
    {
      name: 'D3 Demo',
      items: [
        { name: 'Line Chart', link: 'line-chart' },
        { name: 'Line Chart Remote', link: 'line-chart-remote' },
        { name: 'Multi Series Chart', link: 'multi-series-chart' },
        { name: 'Area Chart', link: 'area-chart' },
        { name: 'Stacked Area Chart', link: 'stacked-area-chart' },
        { name: 'Stream Area Chart', link: 'stream-area-chart' },

        { name: 'Bar Chart', link: 'bar-chart' },
        { name: 'Historical Bar Chart', link: 'historical-bar-chart' },
        { name: 'Grouped Bar Chart', link: 'grouped-bar-chart' },
        { name: 'Stacked Bar Chart', link: 'stacked-bar-chart' },
        { name: 'Linear Stacked Bar Chart', link: 'linear-stacked-bar-chart' },

        { name: 'Horizontal Bar Chart', link: 'horizontal-bar-chart' },
        { name: 'Grouped Horizontal Bar Chart', link: 'grouped-horizontal-bar-chart' },
        { name: 'Stacked Horizontal Bar Chart', link: 'stacked-horizontal-bar-chart' },
        { name: 'Stacked Normalized Horizontal Bar', link: 'stacked-normalized-horizontal-bar-chart' },

        { name: 'Bullet Chart Demo', link: 'bullet-chart-demo' },
        { name: 'Vertical Bullet Chart Demo', link: 'vertical-bullet-chart-demo' },
      ],
    },
    {
      name: 'D3 Demos2',
      items: [
        { name: 'Pie Chart', link: 'pie-chart-demo' },
        { name: 'Donut Chart', link: 'donut-chart-demo' },
        { name: 'Radial Gauge Demo', link: 'radial-gauge-demo' },
        { name: 'Radial Gauge Demo2', link: 'radial-gauge-demo2' },
        { name: 'Candle Stick Bar Chart', link: 'candle-stick-chart' },
        { name: 'CPI Inflation', link: 'cpi-chart' },
        { name: 'SPY Stock', link: 'stock-chart' },
        { name: 'Stock History Bar Chart', link: 'stock-history-demo' },
      ],
    },
    {
      name: 'D3 Demo 3',
      items: [
        { name: 'Line Chart', link: 'line-chart' },
        { name: 'Line Chart Remote', link: 'line-chart-remote' },
        { name: 'Multi Series Chart', link: 'multi-series-chart' },
        { name: 'Area Chart', link: 'area-chart' },
        { name: 'Stacked Area Chart', link: 'stacked-area-chart' },
        { name: 'Stream Area Chart', link: 'stream-area-chart' },

        { name: 'Bar Chart', link: 'bar-chart' },
        { name: 'Historical Bar Chart', link: 'historical-bar-chart' },
        { name: 'Grouped Bar Chart', link: 'grouped-bar-chart' },
        { name: 'Stacked Bar Chart', link: 'stacked-bar-chart' },
        { name: 'Linear Stacked Bar Chart', link: 'linear-stacked-bar-chart' },

        { name: 'Horizontal Bar Chart', link: 'horizontal-bar-chart' },
        { name: 'Grouped Horizontal Bar Chart', link: 'grouped-horizontal-bar-chart' },
        { name: 'Stacked Horizontal Bar Chart', link: 'stacked-horizontal-bar-chart' },
        { name: 'Stacked Normalized Horizontal Bar', link: 'stacked-normalized-horizontal-bar-chart' },

        { name: 'Bullet Chart Demo', link: 'bullet-chart-demo' },
        { name: 'Vertical Bullet Chart Demo', link: 'vertical-bullet-chart-demo' },
      ],
    },
    {
      name: 'D3 Demo 4',
      //expanded: true,
      items: [
        { name: 'Line Chart', link: 'line-chart' },
        { name: 'Line Chart Remote', link: 'line-chart-remote' },
        { name: 'Multi Series Chart', link: 'multi-series-chart' },
        { name: 'Area Chart', link: 'area-chart' },
        { name: 'Stacked Area Chart', link: 'stacked-area-chart' },
        { name: 'Stream Area Chart', link: 'stream-area-chart' },

        { name: 'Bar Chart', link: 'bar-chart' },
        { name: 'Historical Bar Chart', link: 'historical-bar-chart' },
        { name: 'Grouped Bar Chart', link: 'grouped-bar-chart' },
        { name: 'Stacked Bar Chart', link: 'stacked-bar-chart' },
        { name: 'Linear Stacked Bar Chart', link: 'linear-stacked-bar-chart' },

        { name: 'Horizontal Bar Chart', link: 'horizontal-bar-chart' },
        { name: 'Grouped Horizontal Bar Chart', link: 'grouped-horizontal-bar-chart' },
        { name: 'Stacked Horizontal Bar Chart', link: 'stacked-horizontal-bar-chart' },
        { name: 'Stacked Normalized Horizontal Bar', link: 'stacked-normalized-horizontal-bar-chart' },

        { name: 'Bullet Chart Demo', link: 'bullet-chart-demo' },
        { name: 'Vertical Bullet Chart Demo', link: 'vertical-bullet-chart-demo' },
      ],
    },
  ];

  menuItemClick(item: IccMenuConfig): void {
    console.log(' d3 menu item clicked=', item);
  }
}
