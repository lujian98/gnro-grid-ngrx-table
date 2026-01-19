import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroTabComponent, GnroTabGroupComponent } from '@gnro/ui/tab-group';
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
  imports: [
    EntityTabsStateModule,
    AppLocationEntityComponent,
    GnroButtonComponent,
    GnroTabGroupComponent,
    GnroTabComponent,
  ],
})
export class AppLocationTabsComponent {
  private entityTabsFacade = inject(EntityTabsFacade);
  selectedIndex: number = 0;
  tabs$ = this.entityTabsFacade.getTabs(FEATURE_NAME.LOCATIONS);

  constructor() {
    this.entityTabsFacade.initializeFeature(FEATURE_NAME.LOCATIONS);
    const activeTab = this.entityTabsFacade.getActiveTab();
    this.selectedIndex = activeTab() ? this.tabs$().findIndex((tab) => tab.id === activeTab()?.id) : 0;
  }

  onSelectedIndexChange(index: number): void {
    const tabs = this.tabs$();
    if (tabs[index]) {
      this.entityTabsFacade.setActiveTab(tabs[index].id);
    }
  }

  newTab(): void {
    const values = locationsData[this.selectedIndex];
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
    this.selectedIndex++;
  }
}
