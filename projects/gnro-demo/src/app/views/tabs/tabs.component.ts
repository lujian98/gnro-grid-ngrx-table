import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IccAccordion, IccAccordionComponent } from '@icc/ui/accordion';
import { IccLayoutCenterComponent, IccLayoutHorizontalComponent, IccLayoutLeftComponent } from '@icc/ui/layout';
import { take, timer } from 'rxjs';
import { IccMenuConfig } from '@icc/ui/menu';
import { IccTabConfig, IccTabsComponent, IccTabsConfig, IccTabOption } from '@icc/ui/tabs';
import { AppStockChartComponent } from '../d3/demos/stock-charts/stock-chart.component';
import { PortalDemoComponent } from '../dashboard/demos/portal-demo/portal-demo.component';
import { PortalDemo2Component } from '../dashboard/demos/portal-demo2/portal-demo2.component';
import { AppGridMultiRowSelectionComponent } from '../grid/remote-data/grid-multi-row-selection.component';
import { AppGridRemoteVirtualScrollComponent } from '../grid/remote-data/grid-virtual-scroll.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
    IccAccordionComponent,
    IccTabsComponent,
  ],
})
export class AppTabsComponent {
  useRouterLink: boolean = false;

  portalData = {
    skills: [1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  };

  portalData2 = {
    skills: [12, 13, 14, 15, 16],
  };

  tabMenus: IccTabConfig[] = [
    {
      name: 'grid-selection1',
      portalName: 'grid-multi-row-selection',
      closeable: false,
      title: 'Grid Multi Row Selection 1',
    },
    { name: 'grid-selection2', portalName: 'grid-multi-row-selection', title: 'Grid Multi Row Selection 2' },
    { name: 'stock-chart', portalName: 'stock-chart', title: 'Stock Chart' },
    { name: 'grid-virtual-scroll', portalName: 'grid-virtual-scroll', title: 'Grid Virtual Scroll' },
    { name: 'portal-demo', portalName: 'portal-demo', context: this.portalData, title: 'Portal Demo' },
    {
      name: 'portal-demo2',
      portalName: 'portal-demo2',
      content: PortalDemo2Component,
      context: this.portalData2,
      title: 'Portal Demo 2',
    },
    { name: 'portal-demo3', portalName: 'portal-demo', context: this.portalData2, title: 'Portal Demo 3' },
    { name: 'six' },
    { name: 'seven' },
  ];

  items: IccAccordion[] = [
    {
      name: 'Tabs Panel Demo',
      items: this.tabMenus,
    },
    {
      name: 'Tabs Demos',
      items: [
        { name: 'Simple Tabs', link: 'simple-tabs' },
        { name: 'Tab Group', link: 'tab-group' },
        { name: 'Tab Form', link: 'tab-form' },
        { name: 'Double Tab Panels', link: 'double-tabs' },
      ],
    },
  ];

  tabsConfig: Partial<IccTabsConfig> = {
    enableContextMenu: true,
    selectedTabIndex: 1,
  };

  options: IccTabOption<unknown>[] = [
    {
      name: 'grid-multi-row-selection',
      content: AppGridMultiRowSelectionComponent,
    },
    {
      name: 'stock-chart',
      content: AppStockChartComponent,
    },
    {
      name: 'grid-virtual-scroll',
      content: AppGridRemoteVirtualScrollComponent,
    },
    {
      name: 'portal-demo',
      content: PortalDemoComponent,
    },
    /*
    {
      name: 'portal-demo2',
      content: PortalDemo2Component,
    },*/
    {
      name: 'six',
      content: 'test6',
    },
    {
      name: 'seven',
      content: 'test7',
    },
  ];

  tabs: IccTabConfig[] = this.options.map((option) => {
    const find = this.tabMenus.find((item) => item.portalName === option.name);
    return { ...option, ...find };
  });

  @ViewChild(IccTabsComponent, { static: false }) tabsPanel!: IccTabsComponent;

  onMenuItemClick(item: IccTabConfig | IccMenuConfig): void {
    if ((item as IccMenuConfig).link) {
      this.useRouterLink = true;
    } else {
      this.useRouterLink = false;
      if (this.tabsPanel) {
        this.tabsPanel.addTab(item);
      } else {
        timer(10)
          .pipe(take(1))
          .subscribe(() => this.tabsPanel.addTab(item));
      }
    }
  }
}
