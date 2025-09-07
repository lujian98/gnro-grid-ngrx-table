import { GnroMenuConfig } from '@gnro/ui/menu';
import { createActionGroup, props } from '@ngrx/store';
import { GnroTabConfig, GnroTabOption, GnroTabsConfig } from '../models/tabs.model';

export const tabsActions = createTabsActions();

export function createTabsActions<T>() {
  return createActionGroup({
    source: '[Tabs]',
    events: {
      'Init Config': props<{ tabsId: string; tabsConfig: GnroTabsConfig }>(),
      'Load Config': props<{ tabsId: string; tabsConfig: GnroTabsConfig }>(),
      'Load Config Success': props<{ tabsId: string; tabsConfig: GnroTabsConfig }>(),
      'Load Tabs': props<{ tabsId: string; tabsConfig: GnroTabsConfig }>(),
      'Load Tabs Success': props<{ tabsId: string; tabs: GnroTabConfig<T>[] }>(),
      'Load Options': props<{ tabsId: string; options: GnroTabOption<T>[] }>(),
      'Add Tab': props<{ tabsId: string; tab: GnroTabConfig<T> }>(),
      'Drag Drop Tab': props<{ tabsId: string; previousIndex: number; currentIndex: number }>(),
      'Set Selected Index': props<{ tabsId: string; index: number }>(),
      'Context Menu Clicked': props<{
        tabsId: string;
        menuItem: GnroMenuConfig;
        tab: GnroTabConfig<T>;
        index: number;
      }>(),
      'Close Tab': props<{ tabsId: string; tab: GnroTabConfig<T> }>(),
      'Clear Store': props<{ tabsId: string }>(),
      'Remove Store': props<{ tabsId: string }>(),
    },
  });
}
