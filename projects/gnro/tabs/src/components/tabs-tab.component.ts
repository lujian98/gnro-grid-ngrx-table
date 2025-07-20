import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GnroDisabled } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroMenuConfig, GnroMenusComponent } from '@gnro/ui/menu';
import { GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverDirective } from '@gnro/ui/popover';
import { GnroTabsStateModule } from '../+state/tabs-state.module';
import { GnroTabsFacade } from '../+state/tabs.facade';
import {
  defaultContextMenu,
  GnroContextMenuType,
  GnroTabConfig,
  GnroTabsConfig,
  GnroTabsSetting,
} from '../models/tabs.model';

@Component({
  selector: 'gnro-tabs-tab',
  templateUrl: './tabs-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, CdkDrag, GnroMenusComponent, GnroPopoverDirective, GnroIconModule, GnroTabsStateModule],
})
export class GnroTabsTabComponent {
  private tabsFacade = inject(GnroTabsFacade);
  position: GnroPosition = GnroPosition.BOTTOMRIGHT;
  contextMenu = defaultContextMenu;

  tabsConfig = input.required<GnroTabsConfig>();
  tabsSetting = input.required<GnroTabsSetting>();
  tab = input.required<GnroTabConfig<unknown>>();
  tabs = input.required<GnroTabConfig<unknown>[]>();
  index = input.required<number>();

  get contextMenuTrigger(): GnroTrigger {
    return this.tabsConfig().enableContextMenu ? GnroTrigger.CONTEXTMENU : GnroTrigger.NOOP;
  }

  dragDisabled(tab: GnroTabConfig<unknown>): boolean {
    return !this.tabsConfig().tabReorder;
  }

  closeable(tab: GnroTabConfig<unknown>): boolean {
    return this.tabsConfig().closeable && !!tab.closeable;
  }

  getTabLabel(tab: GnroTabConfig<unknown>): string {
    return tab.title || tab.name;
  }

  getDisabled(tab: GnroTabConfig<unknown>): GnroDisabled[] {
    return [...defaultContextMenu].map((menu) => ({
      name: menu.name,
      disabled: this.menuItemDisabled(menu.name, tab, this.index()),
    }));
  }

  private menuItemDisabled(name: GnroContextMenuType, tab: GnroTabConfig<unknown>, index: number): boolean {
    switch (name) {
      case GnroContextMenuType.CLOSE:
        return !tab.closeable;
      case GnroContextMenuType.CLOSE_OTHER_TABS:
        return [...this.tabs()].filter((item) => item.name === tab.name || !item.closeable).length === this.tabs.length;
      case GnroContextMenuType.CLOSE_TABS_TO_THE_RIGHT:
        return [...this.tabs()].filter((item, idx) => idx < index + 1 || !item.closeable).length === this.tabs.length;
      case GnroContextMenuType.CLOSE_TABS_TO_THE_LEFT:
        const right = [...this.tabs()].slice(index);
        const notCloseable = [...this.tabs()].slice(0, index).filter((item) => !item.closeable);
        return [...notCloseable, ...right].length === this.tabs.length;
      case GnroContextMenuType.CLOSE_ALL_TABS:
        return [...this.tabs()].filter((item) => item.closeable).length === 0;
    }
  }

  onContextMenuClicked(menuItem: GnroMenuConfig, tab: GnroTabConfig<unknown>): void {
    this.tabsFacade.setContextMenuClicked(this.tabsSetting().tabsId, menuItem, tab, this.index());
  }

  closeTab(event: MouseEvent, tab: GnroTabConfig<unknown>): void {
    event.stopPropagation();
    this.tabsFacade.setCloseTab(this.tabsSetting().tabsId, tab);
  }
}
