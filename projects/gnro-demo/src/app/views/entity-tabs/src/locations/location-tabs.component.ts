import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTabConfig, GnroTabsComponent, GnroTabsConfig } from '@gnro/ui/tabs';
import { AppStockChartComponent } from '../../../d3/demos/stock-charts/stock-chart.component';
import { AppGridMultiRowSelectionComponent } from '../../../grid/remote-data/grid-multi-row-selection.component';
import { AppGridRemoteVirtualScrollComponent } from '../../../grid/remote-data/grid-virtual-scroll.component';
import { AppLocationEntityComponent } from './panels/location-entity.component';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTabsComponent, AppLocationEntityComponent],
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
      name: 'two',
      title: 'Two3',
      content: AppStockChartComponent,
      closeable: false,
      //disabled: true,
    },
    {
      name: 'three',
      content: AppLocationEntityComponent,
      closeable: true,
    },
  ];
}
