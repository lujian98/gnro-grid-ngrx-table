import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, output } from '@angular/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { uniqueId } from '@gnro/ui/core';
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
  private readonly tabsId = `tabs-${uniqueId()}`;
  tabsConfig$ = this.tabsFacade.getConfig(this.tabsId);
  tabsSetting$ = this.tabsFacade.getSetting(this.tabsId);
  tabsTabs$ = this.tabsFacade.getTabs(this.tabsId);
  position: GnroPosition = GnroPosition.BOTTOMRIGHT;
  menuItem = defaultContextMenu;

  tabsConfig = input.required({
    transform: (value: Partial<GnroTabsConfig>) => {
      const config = { ...defaultTabsConfig, ...value };
      this.tabsFacade.setConfig(this.tabsId, config);
      return config;
    },
  });
  options = input([], {
    transform: (options: GnroTabOption<T>[]) => {
      this.tabsFacade.setOptions(this.tabsId, options);
      return options;
    },
  });
  tabs = input([], {
    transform: (tabs: GnroTabConfig<T>[]) => {
      if (this.tabsConfig() && !this.tabsConfig().remoteTabs) {
        this.tabsFacade.setTabs(this.tabsId, tabs);
      }
      return tabs;
    },
  });

  selectedIndexChange = output<number>();

  constructor() {
    this.tabsFacade.initConfig(this.tabsId, defaultTabsConfig);
  }

  onSelectedIndexChange(index: number): void {
    this.tabsFacade.setSelectedIndex(this.tabsId, index);
    this.selectedIndexChange.emit(index);
  }

  drop(event: CdkDragDrop<GnroTabConfig<T>>): void {
    this.tabsFacade.dragDropTab(this.tabsId, event.previousIndex, event.currentIndex);
  }

  // add tab from left side menu
  addTab(tabItem: GnroTabConfig<T>): void {
    this.tabsFacade.addTab(this.tabsId, tabItem);
  }

  ngOnDestroy(): void {
    this.tabsFacade.clearStore(this.tabsId);
  }
}
