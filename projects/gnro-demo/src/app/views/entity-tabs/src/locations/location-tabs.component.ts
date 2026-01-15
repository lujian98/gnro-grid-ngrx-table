import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { GnroTabConfig, GnroTabsComponent, GnroTabsConfig } from '@gnro/ui/tabs';
import { AppLocationEntityComponent } from './panels/location-entity.component';
import { GnroButtonComponent } from '@gnro/ui/button';
import { EntityTabsFacade } from '../libs/entity-tabs/+state/entity-tabs.facade';
import { locationsData } from './locations.data';

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
      name: 'Entity1',
      title: 'Entity01',
      content: AppLocationEntityComponent,
      closeable: true,
    },
  ];

  @ViewChild(GnroTabsComponent, { static: false }) tabsPanel!: GnroTabsComponent<unknown>;
  private tabDataIndex = 0;

  newTab(): void {
    const values = locationsData[this.tabDataIndex];
    const item = {
      id: values['id'],
      name: values['nodeCode'],
      title: values['nodeCode'],
      content: AppLocationEntityComponent,
      context: {
        tabId: values['id'],
      },
      closeable: true,
    };
    this.tabsPanel.addTab(item);
    this.tabDataIndex++;
  }
}

/*
      context: {
        form: this.form,
        values: ['test1', 'test2', 'test3'],
      },
      */
