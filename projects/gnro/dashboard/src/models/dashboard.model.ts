import { GnroPortalContent } from '@gnro/ui/portal';

export interface GnroDashboardConfig {
  gridGap: number;
  gridWidth: number;
  gridHeight: number;
  cols: number;
  rows: number;
  remoteConfig: boolean;
  //remoteOptions: boolean; // options list cannot be remote due the GnroPortalContent mapping!!
  remoteTiles: boolean;
}

export const defaultDashboardConfig: GnroDashboardConfig = {
  gridGap: 2,
  gridWidth: 100,
  gridHeight: 100,
  cols: 10,
  rows: 6,
  remoteConfig: false,
  //remoteOptions: false,
  remoteTiles: false,
};

export interface GnroDashboardSetting {
  // for internal setting
  dashboardId: string;
  viewportReady: boolean; //not used
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridMap: number[][];
}

export interface DashboardState {
  [key: string]: GnroDashboardState;
}

export interface GnroTile<T> {
  name: string;
  title?: string;
  rowStart?: number;
  colStart?: number;
  rowHeight?: number;
  colWidth?: number;
  portalName?: string; // use for save component mapping key
  content?: GnroPortalContent<T>;
  context?: {};
  dragDisabled?: boolean;
  enableContextMenu?: boolean;
  color?: string; //no need can be removed
  index?: number; // internal use?
  gridColumn?: string; // internal use?
  gridRow?: string; // internal use?
}

export const defaultTileConfig = {
  name: 'tilename',
  dragDisabled: false,
  enableContextMenu: true,
};

export interface GnroDashboardState {
  dashboardConfig: GnroDashboardConfig;
  dashboardSetting: GnroDashboardSetting;
  tiles: GnroTile<unknown>[];
  options: GnroTile<unknown>[]; // options are input to tabs mapped using portalName to portal component
}

export const defaultDashboardSetting: GnroDashboardSetting = {
  dashboardId: '191cf2bb6b5',
  viewportReady: false,
  gridTemplateColumns: '',
  gridTemplateRows: '',
  gridMap: [],
};

export const defaultDashboardState: GnroDashboardState = {
  dashboardConfig: defaultDashboardConfig,
  dashboardSetting: defaultDashboardSetting,
  tiles: [],
  options: [],
};

export interface GnroTileOption<T> {
  name: string;
  title?: string;
  content: GnroPortalContent<T>;
}

export interface GnroTileInfo {
  rowStart: number;
  colStart: number;
  rowHeight: number;
  colWidth: number;
}

export interface GnroTileResizeMap {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  colChange: number;
  rowChange: number;
}

export interface DxyPosition {
  dx: number;
  dy: number;
}

export enum GnroDashboardMenuType {
  CONFIGURE = 'Configure',
  REMOVE = 'Remove',
}

export const defaultTileMenus = [
  {
    title: 'GNRO.UI.ACTIONS.CONFIGURE',
    name: GnroDashboardMenuType.CONFIGURE,
    icon: 'pen-to-square',
  },
  {
    title: 'GNRO.UI.ACTIONS.REMOVE',
    name: GnroDashboardMenuType.REMOVE,
    icon: 'trash',
  },
];
