import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccTabsComponent, IccTabsConfig } from '@icc/ui/tabs';
import { AppStockChartComponent } from '../../d3/demos/stock-charts/stock-chart.component';
import { AppGridRemoteVirtualScrollComponent } from '../../grid/remote-data/grid-virtual-scroll.component';
import { AppGridMultiRowSelectionComponent } from '../../grid/remote-data/grid-multi-row-selection.component';
import { PortalDemoComponent } from '../../dashboard/demos/portal-demo/portal-demo.component';
import { PortalDemo2Component } from '../../dashboard/demos/portal-demo2/portal-demo2.component';
import { AppGridGroupHeaderComponent } from '../../grid/remote-data/grid-group-header.component';

@Component({
  selector: 'app-double-tabs',
  template: `
    <icc-tabs [tabsConfig]="tabsConfig1" [tabs]="tabs"></icc-tabs>
    <icc-tabs [tabsConfig]="tabsConfig2" [tabs]="tabs2"> </icc-tabs>
  `,
  styles: [':host {  display: flex; flex-direction: column; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTabsComponent],
})
export class AppDoubleTabsComponent {
  tabsConfig1: Partial<IccTabsConfig> = {
    enableContextMenu: true,
    selectedTabIndex: 2,
    alignTabs: 'end',
  };

  tabsConfig2: Partial<IccTabsConfig> = {
    enableContextMenu: true,
    alignTabs: 'center',
  };

  portalData = {
    skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  };

  portalData2 = {
    skills: [12, 13, 14, 15, 16],
  };

  tabs = [
    {
      name: 'one',
      content: AppGridMultiRowSelectionComponent,
    },
    {
      name: 'two',
      title: 'Two',
      content: AppStockChartComponent,
    },
    {
      name: 'three',
      content: AppGridRemoteVirtualScrollComponent,
    },
    {
      name: 'four',
      content: PortalDemoComponent,
      context: this.portalData,
    },
    {
      name: 'five',
      content: PortalDemo2Component,
      context: this.portalData2,
    },
    {
      name: 'six',
      content: 'test6',
    },
    {
      name: 'seven',
    },
  ];

  tabs2 = [
    {
      name: 'one',
      content: AppGridMultiRowSelectionComponent,
    },
    {
      name: 'two',
      content: AppGridGroupHeaderComponent,
    },
    {
      name: 'three',
      content: AppStockChartComponent,
    },
    {
      name: 'four',
      content: PortalDemoComponent,
      context: this.portalData,
    },
    {
      name: 'five',
      content: PortalDemo2Component,
      context: this.portalData2,
    },
    {
      name: 'six',
      content: 'test6',
    },
    {
      name: 'seven',
    },
  ];
}
