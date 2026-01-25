import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, Type } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroTabComponent, GnroTabGroupComponent } from '@gnro/ui/tab-group';
import { EntityTabsFacade } from './+state/entity-tabs.facade';
import { entityMockData } from './entity-mock.data';
import { AppEntityTab } from './models/entity-tabs.model';

@Component({
  selector: 'lib-entity-tabs',
  templateUrl: './entity-tabs.component.html',
  styleUrls: ['./entity-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, GnroButtonComponent, GnroTabGroupComponent, GnroTabComponent],
})
export class EntityTabsComponent<T> {
  private readonly entityTabsFacade = inject(EntityTabsFacade);
  readonly tabs$ = this.entityTabsFacade.getTabs();
  readonly activeTab = this.entityTabsFacade.getActiveTab();
  selectedIndex: number = 0;

  entity = input.required<Type<T>>();

  constructor() {
    this.selectedIndex = this.activeTab() ? this.tabs$().findIndex((tab) => tab.id === this.activeTab()?.id) : 0;
  }

  onSelectedIndexChange(index: number): void {
    const tabs = this.tabs$();
    if (tabs[index]) {
      this.entityTabsFacade.setActiveTab(tabs[index].id);
    }
  }

  addTab(): void {
    const values = entityMockData[this.selectedIndex];
    if (values) {
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
    }
  }

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
