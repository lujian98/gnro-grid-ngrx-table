import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy } from '@angular/core';
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
export class GnroTabsComponent implements OnDestroy {
  private readonly tabsFacade = inject(GnroTabsFacade);
  private readonly tabsId = `tab-${crypto.randomUUID()}`;
  tabsConfig$ = this.tabsFacade.getTabsConfig(this.tabsId);
  tabsSetting$ = this.tabsFacade.getSetting(this.tabsId);
  tabsTabs$ = this.tabsFacade.getTabsTabs(this.tabsId);
  position: GnroPosition = GnroPosition.BOTTOMRIGHT;
  menuItem = defaultContextMenu;

  tabsConfig = input.required({
    transform: (value: Partial<GnroTabsConfig>) => {
      const config = { ...defaultTabsConfig, ...value };
      this.tabsFacade.setTabsConfig(this.tabsId, config);
      return config;
    },
  });
  options = input([], {
    transform: (options: GnroTabOption<unknown>[]) => {
      this.tabsFacade.setTabsOptions(this.tabsId, options);
      return options;
    },
  });
  tabs = input([], {
    transform: (tabs: GnroTabConfig[]) => {
      if (this.tabsConfig() && !this.tabsConfig().remoteTabs) {
        this.tabsFacade.setTabsTabs(this.tabsId, tabs);
      }
      return tabs;
    },
  });

  constructor() {
    this.tabsFacade.initTabsConfig(this.tabsId, defaultTabsConfig);
  }

  onSelectedIndexChange(index: number): void {
    this.tabsFacade.setSelectedIndex(this.tabsId, index);
  }

  drop(event: CdkDragDrop<GnroTabConfig>): void {
    this.tabsFacade.setDragDropTab(this.tabsId, event.previousIndex, event.currentIndex);
  }

  // add tab from left side menu
  addTab(tabItem: GnroTabConfig): void {
    this.tabsFacade.setAddTab(this.tabsId, tabItem);
  }

  ngOnDestroy(): void {
    this.tabsFacade.clearTabsStore(this.tabsId);
  }
}
