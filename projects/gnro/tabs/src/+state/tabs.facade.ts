import { inject, Injectable, Signal } from '@angular/core';
import { GnroMenuConfig } from '@gnro/ui/menu';
import { Store } from '@ngrx/store';
import { GnroTabConfig, GnroTabOption, GnroTabsConfig, GnroTabsSetting } from '../models/tabs.model';
import { GnroTabsFeatureService } from './tabs-state.module';
import { tabsActions } from './tabs.actions';
import { createTabsSelectorsForFeature } from './tabs.selectors';

@Injectable({ providedIn: 'root' })
export class GnroTabsFacade {
  private readonly store = inject(Store);
  private readonly tabsFeatureService = inject(GnroTabsFeatureService);

  initConfig(tabsName: string, tabsConfig: GnroTabsConfig): void {
    this.tabsFeatureService.registerFeature(tabsName);
    this.store.dispatch(tabsActions.initConfig({ tabsName, tabsConfig }));
    if (tabsConfig.remoteConfig) {
      this.store.dispatch(tabsActions.loadConfig({ tabsName, tabsConfig }));
    }
  }

  setConfig(tabsName: string, tabsConfig: GnroTabsConfig): void {
    this.store.dispatch(tabsActions.loadConfigSuccess({ tabsName, tabsConfig }));
  }

  setTabs<T>(tabsName: string, tabs: GnroTabConfig<T>[]): void {
    this.store.dispatch(tabsActions.loadTabsSuccess({ tabsName, tabs }));
  }

  setOptions<T>(tabsName: string, options: GnroTabOption<T>[]): void {
    this.store.dispatch(tabsActions.loadOptions({ tabsName, options }));
  }

  setSelectedIndex(tabsName: string, index: number): void {
    this.store.dispatch(tabsActions.setSelectedIndex({ tabsName, index }));
  }

  addTab<T>(tabsName: string, tab: GnroTabConfig<T>): void {
    this.store.dispatch(tabsActions.addTab({ tabsName, tab }));
  }

  dragDropTab(tabsName: string, previousIndex: number, currentIndex: number): void {
    this.store.dispatch(tabsActions.dragDropTab({ tabsName, previousIndex, currentIndex }));
  }

  contextMenuClicked<T>(tabsName: string, menuItem: GnroMenuConfig, tab: GnroTabConfig<T>, index: number): void {
    this.store.dispatch(tabsActions.contextMenuClicked({ tabsName, menuItem, tab, index }));
  }

  closeTab<T>(tabsName: string, tab: GnroTabConfig<T>): void {
    this.store.dispatch(tabsActions.closeTab({ tabsName, tab }));
  }

  clearStore(tabsName: string): void {
    this.store.dispatch(tabsActions.clearStore({ tabsName }));
  }

  getSetting(tabsName: string): Signal<GnroTabsSetting> {
    const selectors = createTabsSelectorsForFeature(tabsName);
    return this.store.selectSignal(selectors.selectTabsSetting);
  }

  getConfig(tabsName: string): Signal<GnroTabsConfig> {
    const selectors = createTabsSelectorsForFeature(tabsName);
    return this.store.selectSignal(selectors.selectTabsConfig);
  }

  getTabs<T>(tabsName: string): Signal<GnroTabConfig<T>[]> {
    const selectors = createTabsSelectorsForFeature(tabsName);
    return this.store.selectSignal(selectors.selectTabsTabs) as Signal<GnroTabConfig<T>[]>;
  }

  getOptions<T>(tabsName: string): Signal<GnroTabConfig<T>[]> {
    const selectors = createTabsSelectorsForFeature(tabsName);
    return this.store.selectSignal(selectors.selectTabsOptions) as Signal<GnroTabConfig<T>[]>;
  }
}
