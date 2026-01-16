import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroTabsComponent, GnroTabsConfig } from '@gnro/ui/tabs';
import { EntityTabsStateModule } from '../libs/entity-tabs/+state/entity-tabs-state.module';
import { EntityTabsFacade } from '../libs/entity-tabs/+state/entity-tabs.facade';
import { AppEntityTab } from '../libs/entity-tabs/models/entity-tabs.model';
import { FEATURE_NAME } from '../libs/entity-tabs/models/feature-name.enum';
import { locationsData } from './locations.data';
import { AppLocationEntityComponent } from './panels/location-entity.component';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EntityTabsStateModule, GnroTabsComponent, GnroButtonComponent],
})
export class AppLocationTabsComponent {
  private entityTabsFacade = inject(EntityTabsFacade);
  tabsConfig: Partial<GnroTabsConfig> = {
    enableContextMenu: true,
  };

  tabs$ = computed(() => {
    const tabs = this.entityTabsFacade.getTabs(FEATURE_NAME.LOCATIONS);
    return tabs().map((tab) => {
      return {
        id: tab.id,
        name: tab.dirty ? `${tab.name} *` : tab.name,
        title: tab.title,
        content: AppLocationEntityComponent,
        context: {
          tabId: tab.id,
        },
        closeable: true,
        dirty: tab.dirty,
      };
    });
  });

  constructor() {
    this.entityTabsFacade.initializeFeature(FEATURE_NAME.LOCATIONS);
    const activeTab = this.entityTabsFacade.getActiveTab();
    this.tabsConfig = {
      ...this.tabsConfig,
      selectedTabIndex: activeTab() ? this.tabs$().findIndex((tab) => tab.id === activeTab()?.id) : 0,
    };
  }

  onSelectedIndexChange(index: number): void {
    const tabs = this.tabs$();
    if (tabs[index]) {
      this.entityTabsFacade.setActiveTab(tabs[index].id);
    }
  }

  private tabDataIndex = 0;

  newTab(): void {
    const values = locationsData[this.tabDataIndex];
    const tab: AppEntityTab = {
      id: values['id'].toString(),
      name: values['nodeCode'] as string,
      title: values['nodeCode'] as string,
      values: values,
      originalValues: values,
      dirty: false,
      editing: false,
      valid: true,
    };

    this.entityTabsFacade.addTab(tab);
    this.tabsConfig = {
      ...this.tabsConfig,
      selectedTabIndex: this.tabDataIndex,
    };
    this.tabDataIndex++;
  }
}
