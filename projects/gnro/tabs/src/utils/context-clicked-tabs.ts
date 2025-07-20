import { GnroMenuConfig } from '@gnro/ui/menu';
import { GnroContextMenuType, GnroTabConfig } from '../models/tabs.model';

export function contextClickedTabs(
  menu: GnroMenuConfig,
  tabs: GnroTabConfig<unknown>[],
  tab: GnroTabConfig<unknown>,
  index: number,
): GnroTabConfig<unknown>[] {
  switch (menu.name) {
    case GnroContextMenuType.CLOSE:
      return [...tabs].filter((item) => item.name !== tab.name || !item.closeable);
    case GnroContextMenuType.CLOSE_OTHER_TABS:
      return [...tabs].filter((item) => item.name === tab.name || !item.closeable);
    case GnroContextMenuType.CLOSE_TABS_TO_THE_RIGHT:
      return [...tabs].filter((item, idx) => idx < index + 1 || !item.closeable);
    case GnroContextMenuType.CLOSE_TABS_TO_THE_LEFT:
      const right = [...tabs].slice(index);
      const notCloseable = [...tabs].slice(0, index).filter((item) => !item.closeable);
      return [...notCloseable, ...right];
    case GnroContextMenuType.CLOSE_ALL_TABS:
      return [...tabs].filter((item) => !item.closeable);
  }
  return [...tabs];
}
