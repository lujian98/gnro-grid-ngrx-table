import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { GnroTabConfig, GnroTabsComponent, GnroTabsConfig } from '@gnro/ui/tabs';
import { AppStockChartComponent } from '../../../d3/demos/stock-charts/stock-chart.component';
import { AppGridMultiRowSelectionComponent } from '../../../grid/remote-data/grid-multi-row-selection.component';
import { AppGridRemoteVirtualScrollComponent } from '../../../grid/remote-data/grid-virtual-scroll.component';
import { AppLocationEntityComponent } from './panels/location-entity.component';
import { GnroButtonComponent } from '@gnro/ui/button';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTabsComponent, AppLocationEntityComponent, GnroButtonComponent],
})
export class AppLocationTabsComponent {
  tabsConfig: Partial<GnroTabsConfig> = {
    enableContextMenu: true,
  };

  tabs: GnroTabConfig<unknown>[] = [
    {
      name: 'Locations',
      content: AppGridMultiRowSelectionComponent,
      closeable: false,
    },
    {
      name: 'Entity1',
      content: AppLocationEntityComponent,
      closeable: true,
    },
  ];

  @ViewChild(GnroTabsComponent, { static: false }) tabsPanel!: GnroTabsComponent<unknown>;
  private totalTabs = this.tabs.length;
  newTab(): void {
    const tabName = `Tab${this.totalTabs + 1}`;
    const item = {
      name: tabName,
      content: AppLocationEntityComponent,
      closeable: true,
    };
    this.tabsPanel.addTab(item);
    this.totalTabs++;
  }
}
