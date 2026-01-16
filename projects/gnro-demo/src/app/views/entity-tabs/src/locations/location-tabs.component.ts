import { ChangeDetectionStrategy, Component, ViewChild, inject, OnInit, computed, OnDestroy } from '@angular/core';
import { GnroTabConfig, GnroTabsComponent, GnroTabsConfig } from '@gnro/ui/tabs';
import { AppLocationEntityComponent } from './panels/location-entity.component';
import { GnroButtonComponent } from '@gnro/ui/button';
import { EntityTabsFacade } from '../libs/entity-tabs/+state/entity-tabs.facade';
import { locationsData } from './locations.data';
import { EntityTabsStateModule } from '../libs/entity-tabs/+state/entity-tabs-state.module';
import { FEATURE_NAME } from '../libs/entity-tabs/models/feature-name.enum';
import { AppEntityTab } from '../libs/entity-tabs/models/entity-tabs.model';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EntityTabsStateModule, GnroTabsComponent, AppLocationEntityComponent, GnroButtonComponent],
})
export class AppLocationTabsComponent implements OnInit, OnDestroy {
  private entityTabsFacade = inject(EntityTabsFacade);
  tabsConfig: Partial<GnroTabsConfig> = {
    enableContextMenu: true,
  };

  tabs$ = computed(() => {
    const tabs = this.entityTabsFacade.getTabs(FEATURE_NAME.LOCATIONS);
    return tabs().map((tab) => {
      return {
        id: tab.id,
        name: tab.name,
        title: tab.title,
        content: AppLocationEntityComponent,
        context: {
          tabId: tab.id,
        },
        closeable: true,
      };
    });
  });

  constructor() {
    this.entityTabsFacade.initializeFeature(FEATURE_NAME.LOCATIONS);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  onSelectedIndexChange(index: number): void {
    const tabs = this.tabs$();
    if (tabs[index]) {
      this.entityTabsFacade.setActiveTab(tabs[index].id);
    }
  }

  @ViewChild(GnroTabsComponent, { static: false }) tabsPanel!: GnroTabsComponent<unknown>;
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
    };

    this.entityTabsFacade.addTab(tab);
    this.tabDataIndex++;
  }
}
