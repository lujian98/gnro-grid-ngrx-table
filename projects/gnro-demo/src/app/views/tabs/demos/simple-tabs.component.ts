import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTabsComponent, GnroTabsConfig, GnroTabConfig } from '@gnro/ui/tabs';
import { AppStockChartComponent } from '../../d3/demos/stock-charts/stock-chart.component';
import { AppGridRemoteVirtualScrollComponent } from '../../grid/remote-data/grid-virtual-scroll.component';
import { AppGridMultiRowSelectionComponent } from '../../grid/remote-data/grid-multi-row-selection.component';
import { PortalDemoComponent } from '../../dashboard/demos/portal-demo/portal-demo.component';
import { PortalDemo2Component } from '../../dashboard/demos/portal-demo2/portal-demo2.component';

@Component({
  selector: 'app-simple-tabs',
  template: `<gnro-tabs [tabsConfig]="tabsConfig" [tabs]="tabs"> </gnro-tabs>`,
  styles: [':host {  display: flex; flex-direction: column; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroTabsComponent],
})
export class AppSimpleTabsComponent {
  tabsConfig: Partial<GnroTabsConfig> = {
    enableContextMenu: true,
  };

  portalData = {
    skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  };

  portalData2 = {
    skills: [12, 13, 14, 15, 16],
  };

  tabs: GnroTabConfig[] = [
    {
      name: 'one',
      content: AppGridMultiRowSelectionComponent,
      closeable: true,
    },
    {
      name: 'two',
      title: 'Two',
      content: AppStockChartComponent,
      closeable: false,
      //disabled: true,
    },
    {
      name: 'three',
      content: AppGridRemoteVirtualScrollComponent,
      closeable: true,
    },
    {
      name: 'four',
      content: PortalDemoComponent,
      context: this.portalData,
      closeable: true,
    },
    {
      name: 'five',
      content: PortalDemo2Component,
      context: this.portalData2,
      closeable: false,
    },
    {
      name: 'six',
      content: 'test6',
      closeable: true,
      disabled: true,
    },
    {
      name: 'seven',
      content: 'test7',
      closeable: true,
    },
  ];

  constructor() {
    const tabs = new Array(30).fill(0).map((_, index) => {
      const j = 8 + index;
      return {
        name: `Tab ${j}`,
        closeable: true,
        content: `Tab ${j}`,
      };
    });

    this.tabs = [...this.tabs, ...tabs];
  }
}
