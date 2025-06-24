import { inject, Injectable, Signal } from '@angular/core';
import { GnroMenuConfig } from '@gnro/ui/menu';
import { Store } from '@ngrx/store';
import { GnroTabConfig, GnroTabOption, GnroTabsConfig, GnroTabsSetting } from '../models/tabs.model';
import * as tabsActions from './tabs.actions';
import { selectTabsConfig, selectTabsOptions, selectTabsSetting, selectTabsTabs } from './tabs.selectors';

@Injectable({ providedIn: 'root' })
export class GnroTabsFacade {
  private store = inject(Store);

  initTabsConfig(tabsId: string, tabsConfig: GnroTabsConfig): void {
    this.store.dispatch(tabsActions.initTabsConfig({ tabsId, tabsConfig }));
    if (tabsConfig.remoteConfig) {
      this.store.dispatch(tabsActions.loadRemoteTabsConfig({ tabsId, tabsConfig }));
    }
  }

  setTabsConfig(tabsId: string, tabsConfig: GnroTabsConfig): void {
    this.store.dispatch(tabsActions.loadTabsConfigSuccess({ tabsId, tabsConfig }));
  }

  setTabsTabs(tabsId: string, tabs: GnroTabConfig[]): void {
    this.store.dispatch(tabsActions.loadTabsTabsSuccess({ tabsId, tabs }));
  }

  setTabsOptions(tabsId: string, options: GnroTabOption<unknown>[]): void {
    this.store.dispatch(tabsActions.loadTabsOptions({ tabsId, options }));
  }

  setSelectedIndex(tabsId: string, index: number): void {
    this.store.dispatch(tabsActions.setSelectedIndex({ tabsId, index }));
  }

  setAddTab(tabsId: string, tab: GnroTabConfig): void {
    this.store.dispatch(tabsActions.setAddTab({ tabsId, tab }));
  }

  setDragDropTab(tabsId: string, previousIndex: number, currentIndex: number): void {
    this.store.dispatch(tabsActions.setDragDropTab({ tabsId, previousIndex, currentIndex }));
  }

  setContextMenuClicked(tabsId: string, menuItem: GnroMenuConfig, tab: GnroTabConfig, index: number): void {
    this.store.dispatch(tabsActions.setContextMenuClicked({ tabsId, menuItem, tab, index }));
  }

  setCloseTab(tabsId: string, tab: GnroTabConfig): void {
    this.store.dispatch(tabsActions.setCloseTab({ tabsId, tab }));
  }

  clearTabsStore(tabsId: string): void {
    this.store.dispatch(tabsActions.clearTabsStore({ tabsId }));
  }

  getSetting(tabsId: string): Signal<GnroTabsSetting> {
    return this.store.selectSignal(selectTabsSetting(tabsId));
  }

  getTabsConfig(tabsId: string): Signal<GnroTabsConfig> {
    return this.store.selectSignal(selectTabsConfig(tabsId));
  }

  getTabsTabs(tabsId: string): Signal<GnroTabConfig[]> {
    return this.store.selectSignal(selectTabsTabs(tabsId));
  }

  getTabsOptions(tabsId: string): Signal<GnroTabConfig[]> {
    return this.store.selectSignal(selectTabsOptions(tabsId));
  }
}
