import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroTabComponent, GnroTabGroupComponent } from '@gnro/ui/tab-group';
import { EntityTabsStateModule } from './+state/entity-tabs-state.module';
import { EntityTabsFacade } from './+state/entity-tabs.facade';
import { AppEntityTab } from './models/entity-tabs.model';
import { FEATURE_NAME } from './models/feature-name.enum';
//import { locationsData } from './locations.data';
//import { AppLocationEntityComponent } from './entity/location-entity.component';

@Component({
  selector: 'lib-entity-tabs',
  templateUrl: './lib-entity-tabs.component.html',
  styleUrls: ['./lib-entity-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EntityTabsStateModule,
    //AppLocationEntityComponent,
    GnroButtonComponent,
    GnroTabGroupComponent,
    GnroTabComponent,
  ],
})
export class EntityTabsComponent {
  private entityTabsFacade = inject(EntityTabsFacade);
  selectedIndex: number = 0;
  tabs$ = this.entityTabsFacade.getTabs(FEATURE_NAME.LOCATIONS);
  readonly activeTab = this.entityTabsFacade.getActiveTab();

  constructor() {
    this.entityTabsFacade.initializeFeature(FEATURE_NAME.LOCATIONS);
    this.selectedIndex = this.activeTab() ? this.tabs$().findIndex((tab) => tab.id === this.activeTab()?.id) : 0;
  }

  onSelectedIndexChange(index: number): void {
    const tabs = this.tabs$();
    if (tabs[index]) {
      this.entityTabsFacade.setActiveTab(tabs[index].id);
    }
  }

  /*
  addTab(): void {
    const values = locationsData[this.selectedIndex];
    const tab: AppEntityTab = {
      id: values['id'].toString(),
      title: values['nodeCode'] as string,
      values: values,
      originalValues: values,
      dirty: false,
      editing: this.selectedIndex === 1,
      invalid: true,
      subtabIndex: 0,
    };
    this.entityTabsFacade.addTab(tab);
    this.selectedIndex++;
  }*/

  edit(): void {
    this.entityTabsFacade.setTabEditing(this.activeTab()?.id!, true);
  }

  view(): void {
    this.entityTabsFacade.setTabEditing(this.activeTab()?.id!, false);
  }

  reset(): void {
    this.entityTabsFacade.setTabEditing(this.activeTab()?.id!, true);
  }

  save(): void {}
}
