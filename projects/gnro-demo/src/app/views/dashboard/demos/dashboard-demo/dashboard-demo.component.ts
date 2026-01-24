import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroDashboardComponent, GnroTile, GnroTileOption, defaultDashboardConfig } from '@gnro/ui/dashboard';
import { AppStockChartComponent } from '../../../d3/demos/stock-charts/stock-chart.component';
import { AppGridMultiRowSelectionComponent } from '../../../grid/remote-data/grid-multi-row-selection.component';
import { AppGridRemoteVirtualScrollComponent } from '../../../grid/remote-data/grid-virtual-scroll.component';
import { PortalDemoComponent } from '../portal-demo/portal-demo.component';
import { PortalDemo2Component } from '../portal-demo2/portal-demo2.component';

@Component({
  selector: 'app-dashboard-demo',
  templateUrl: './dashboard-demo.component.html',
  styleUrls: ['./dashboard-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroDashboardComponent],
})
export class AppDashboardDemoComponent implements OnInit {
  config = defaultDashboardConfig;
  tiles: GnroTile<any>[] = [];
  tileOptions: GnroTileOption<unknown>[] = [
    {
      name: 'stock-chart',
      content: AppStockChartComponent,
    },
    {
      name: 'grid-multi-row-selection',
      content: AppGridMultiRowSelectionComponent,
    },
    {
      name: 'grid-virtual-scroll',
      content: AppGridRemoteVirtualScrollComponent,
    },
    {
      name: 'portal-demo',
      content: PortalDemoComponent,
    },
    {
      name: 'portal-demo2',
      content: PortalDemo2Component,
    },
  ];

  portalData = {
    skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  };

  portalData2 = {
    skills: [12, 13, 14, 15, 16],
  };

  ngOnInit() {}

  constructor() {
    this.tiles = [
      {
        name: 'Card 1',
        title: 'test 987',
        rowStart: 4,
        rowHeight: 3,
        colStart: 1,
        colWidth: 10,
        //titeType: 'stock-chart',
        content: AppStockChartComponent,
      },
      {
        name: 'Card 2',
        title: 'Card 2',
        rowStart: 1,
        rowHeight: 2,
        colStart: 1,
        colWidth: 2,
        portalName: 'portal-demo',
        context: this.portalData,
      },
      {
        name: 'Card 3',
        title: 'Card 3',
        rowStart: 1,
        rowHeight: 1,
        colStart: 3,
        colWidth: 1,
        portalName: 'portal-demo2',
        context: this.portalData,
      },
      {
        name: 'Card 4',
        title: 'Card 4',
        rowStart: 2,
        rowHeight: 1,
        colStart: 3,
        colWidth: 1,
        portalName: 'portal-demo',
        context: this.portalData2,
      },
      {
        name: 'Card 5',
        title: 'Card 5',
        rowStart: 1,
        rowHeight: 3,
        colStart: 4,
        colWidth: 7,
        portalName: 'grid-multi-row-selection',
      },
    ];
  }
}
