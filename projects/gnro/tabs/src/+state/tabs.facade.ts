import { inject, Injectable, Signal } from '@angular/core';
import { GnroMenuConfig } from '@gnro/ui/menu';
import { Store } from '@ngrx/store';
import { GnroTabConfig, GnroTabOption, GnroTabsConfig, GnroTabsSetting } from '../models/tabs.model';
import { tabsActions } from './tabs.actions';
import { selectTabsConfig, selectTabsOptions, selectTabsSetting, selectTabsTabs } from './tabs.selectors';

@Injectable({ providedIn: 'root' })
export class GnroTabsFacade {
  private store = inject(Store);

  initConfig(tabsId: string, tabsConfig: GnroTabsConfig): void {
    this.store.dispatch(tabsActions.initConfig({ tabsId, tabsConfig }));
    if (tabsConfig.remoteConfig) {
      this.store.dispatch(tabsActions.loadConfig({ tabsId, tabsConfig }));
    }
  }

  setConfig(tabsId: string, tabsConfig: GnroTabsConfig): void {
    this.store.dispatch(tabsActions.loadConfigSuccess({ tabsId, tabsConfig }));
  }

  setTabs<T>(tabsId: string, tabs: GnroTabConfig<T>[]): void {
    this.store.dispatch(tabsActions.loadTabsSuccess({ tabsId, tabs }));
  }

  setOptions<T>(tabsId: string, options: GnroTabOption<T>[]): void {
    this.store.dispatch(tabsActions.loadOptions({ tabsId, options }));
  }

  setSelectedIndex(tabsId: string, index: number): void {
    this.store.dispatch(tabsActions.setSelectedIndex({ tabsId, index }));
  }

  addTab<T>(tabsId: string, tab: GnroTabConfig<T>): void {
    this.store.dispatch(tabsActions.addTab({ tabsId, tab }));
  }

  dragDropTab(tabsId: string, previousIndex: number, currentIndex: number): void {
    this.store.dispatch(tabsActions.dragDropTab({ tabsId, previousIndex, currentIndex }));
  }

  contextMenuClicked<T>(tabsId: string, menuItem: GnroMenuConfig, tab: GnroTabConfig<T>, index: number): void {
    this.store.dispatch(tabsActions.contextMenuClicked({ tabsId, menuItem, tab, index }));
  }

  closeTab<T>(tabsId: string, tab: GnroTabConfig<T>): void {
    this.store.dispatch(tabsActions.closeTab({ tabsId, tab }));
  }

  clearStore(tabsId: string): void {
    this.store.dispatch(tabsActions.clearStore({ tabsId }));
  }

  getSetting(tabsId: string): Signal<GnroTabsSetting> {
    return this.store.selectSignal(selectTabsSetting(tabsId));
  }

  getConfig(tabsId: string): Signal<GnroTabsConfig> {
    return this.store.selectSignal(selectTabsConfig(tabsId));
  }

  getTabs(tabsId: string): Signal<GnroTabConfig<unknown>[]> {
    return this.store.selectSignal(selectTabsTabs(tabsId));
  }

  getOptions(tabsId: string): Signal<GnroTabConfig<unknown>[]> {
    return this.store.selectSignal(selectTabsOptions(tabsId));
  }
}
