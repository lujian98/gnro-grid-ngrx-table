import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, output, Signal } from '@angular/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroPosition } from '@gnro/ui/overlay';
import { GnroPortalComponent } from '@gnro/ui/portal';
import { GnroTabComponent, GnroTabGroupComponent, GnroTabLabelDirective } from '@gnro/ui/tab-group';
import { GnroTabsStateModule } from './+state/tabs-state.module';
import { GnroTabsFacade } from './+state/tabs.facade';
import { GnroTabsTabComponent } from './components/tabs-tab.component';
import {
  defaultContextMenu,
  defaultTabsConfig,
  GnroTabConfig,
  GnroTabOption,
  GnroTabsConfig,
  GnroTabsSetting,
} from './models/tabs.model';

@Component({
  selector: 'gnro-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    CdkDropList,
    GnroTabLabelDirective,
    GnroTabComponent,
    GnroTabGroupComponent,
    GnroPortalComponent,
    GnroIconModule,
    GnroTabsStateModule,
    GnroTabsTabComponent,
  ],
})
export class GnroTabsComponent<T> implements OnDestroy {
  private readonly tabsFacade = inject(GnroTabsFacade);
  position: GnroPosition = GnroPosition.BOTTOMRIGHT;
  menuItem = defaultContextMenu;

  tabsConfig = input.required({
    transform: (value: Partial<GnroTabsConfig>) => {
      const config = { ...defaultTabsConfig, ...value };
      this.initTabsConfig(config);
      return config;
    },
  });
  options = input([], {
    transform: (options: GnroTabOption<T>[]) => {
      this.tabsFacade.setOptions(this.tabsConfig().tabsName, options);
      return options;
    },
  });
  tabs = input([], {
    transform: (tabs: GnroTabConfig<T>[]) => {
      if (this.tabsConfig() && !this.tabsConfig().remoteTabs) {
        this.tabsFacade.setTabs(this.tabsConfig().tabsName, tabs);
      }
      return tabs;
    },
  });

  // Computed signals for reactive data binding
  tabsConfig$: Signal<GnroTabsConfig> = computed(() => this.tabsFacade.getConfig(this.tabsConfig().tabsName)());
  tabsSetting$: Signal<GnroTabsSetting> = computed(() => this.tabsFacade.getSetting(this.tabsConfig().tabsName)());
  tabsTabs$: Signal<GnroTabConfig<T>[]> = computed(() => this.tabsFacade.getTabs<T>(this.tabsConfig().tabsName)());

  selectedIndexChange = output<number>();

  private initTabsConfig(config: GnroTabsConfig): void {
    this.tabsFacade.initConfig(config.tabsName, config);
  }

  onSelectedIndexChange(index: number): void {
    this.tabsFacade.setSelectedIndex(this.tabsConfig().tabsName, index);
    this.selectedIndexChange.emit(index);
  }

  drop(event: CdkDragDrop<GnroTabConfig<T>>): void {
    this.tabsFacade.dragDropTab(this.tabsConfig().tabsName, event.previousIndex, event.currentIndex);
  }

  // add tab from left side menu
  addTab(tabItem: GnroTabConfig<T>): void {
    this.tabsFacade.addTab(this.tabsConfig().tabsName, tabItem);
  }

  ngOnDestroy(): void {
    this.tabsFacade.clearStore(this.tabsConfig().tabsName);
  }
}
