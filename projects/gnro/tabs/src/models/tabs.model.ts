import { GnroPortalContent } from '@gnro/ui/portal';
import { GnroTabGroupConfig } from '@gnro/ui/tab-group';

export interface GnroTabConfig<T> {
  name: string;
  title?: string;
  content?: GnroPortalContent<T>;
  context?: {};
  closeable?: boolean;
  disabled?: boolean;
  portalName?: string; //used for mapping content to save config
}

export interface GnroTabOption<T> {
  name: string;
  title?: string;
  content: GnroPortalContent<T>;
}

export interface GnroTabsConfig extends GnroTabGroupConfig {
  tabReorder: boolean;
  closeable: boolean;
  enableContextMenu: boolean;
  selectedTabIndex: number;
  name: string;
  urlKey: string; // Only for remote tab config and options
  remoteConfig: boolean; // remote config requires remote options
  //remoteOptions: boolean; // options list cannot be remote due the GnroPortalContent mapping!!
  remoteTabs: boolean;
}

export interface GnroTabsConfigResponse {
  tabsConfig: Partial<GnroTabsConfig>;
}

export const defaultTabsConfig: GnroTabsConfig = {
  tabReorder: true,
  closeable: true,
  enableContextMenu: false,
  selectedTabIndex: 0,
  alignTabs: 'start',
  name: 'tabs',
  urlKey: 'tabs',
  remoteConfig: false,
  remoteTabs: false,
};

export interface GnroTabsSetting {
  // for internal setting
  tabsId: string;
  viewportReady: boolean; //not used
}

export interface TabsState<T> {
  [key: string]: GnroTabsState<T>;
}

export interface GnroTabsState<T> {
  tabsConfig: GnroTabsConfig;
  tabsSetting: GnroTabsSetting;
  tabs: GnroTabConfig<T>[];
  options: GnroTabOption<T>[]; // options are input to tabs mapped using portalName to portal component
}

export const defaultTabsSetting: GnroTabsSetting = {
  tabsId: '191cf2bb6b5',
  viewportReady: false,
};

export function defaultTabsState<T>(): GnroTabsState<T> {
  return {
    tabsConfig: defaultTabsConfig,
    tabsSetting: defaultTabsSetting,
    tabs: [],
    options: [],
  };
}

export enum GnroContextMenuType {
  CLOSE = 'Close',
  CLOSE_OTHER_TABS = 'Close Other Tabs',
  CLOSE_TABS_TO_THE_RIGHT = 'Close Tabs To The Right',
  CLOSE_TABS_TO_THE_LEFT = 'Close Tabs To The Left',
  CLOSE_ALL_TABS = 'Close All Tabs',
}

export const defaultContextMenu = [
  {
    title: 'GNRO.UI.ACTIONS.CLOSE',
    name: GnroContextMenuType.CLOSE,
  },
  {
    title: 'GNRO.UI.TABS.CLOSE_OTHER_TABS',
    name: GnroContextMenuType.CLOSE_OTHER_TABS,
  },
  {
    title: 'GNRO.UI.TABS.CLOSE_TABS_TO_THE_RIGHT',
    name: GnroContextMenuType.CLOSE_TABS_TO_THE_RIGHT,
  },
  {
    title: 'GNRO.UI.TABS.CLOSE_TABS_TO_THE_LEFT',
    name: GnroContextMenuType.CLOSE_TABS_TO_THE_LEFT,
  },
  {
    title: 'GNRO.UI.TABS.CLOSE_ALL_TABS',
    name: GnroContextMenuType.CLOSE_ALL_TABS,
  },
];
