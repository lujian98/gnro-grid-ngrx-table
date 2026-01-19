import { GnroMenuConfig } from '@gnro/ui/menu';
import { createActionGroup, props } from '@ngrx/store';
import { GnroTabConfig, GnroTabOption, GnroTabsConfig } from '../models/tabs.model';

export const tabsActions = createTabsActions();

function createTabsActions<T>() {
  return createActionGroup({
    source: 'Tabs',
    events: {
      'Init Config': props<{ tabsName: string; tabsConfig: GnroTabsConfig }>(),
      'Load Config': props<{ tabsName: string; tabsConfig: GnroTabsConfig }>(),
      'Load Config Success': props<{ tabsName: string; tabsConfig: GnroTabsConfig }>(),
      'Load Tabs': props<{ tabsName: string; tabsConfig: GnroTabsConfig }>(),
      'Load Tabs Success': props<{ tabsName: string; tabs: GnroTabConfig<T>[] }>(),
      'Load Options': props<{ tabsName: string; options: GnroTabOption<T>[] }>(),
      'Add Tab': props<{ tabsName: string; tab: GnroTabConfig<T> }>(),
      'Drag Drop Tab': props<{ tabsName: string; previousIndex: number; currentIndex: number }>(),
      'Set Selected Index': props<{ tabsName: string; index: number }>(),
      'Context Menu Clicked': props<{
        tabsName: string;
        menuItem: GnroMenuConfig;
        tab: GnroTabConfig<T>;
        index: number;
      }>(),
      'Close Tab': props<{ tabsName: string; tab: GnroTabConfig<T> }>(),
      'Clear Store': props<{ tabsName: string }>(),
      'Remove Store': props<{ tabsName: string }>(),
    },
  });
}
