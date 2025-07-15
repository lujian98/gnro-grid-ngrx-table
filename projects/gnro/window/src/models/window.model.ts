export enum GnroPositionType {
  DEFAULT = 'default',
  BOTTOMMIDDLE = 'bottomMiddle',
  BOTTOMRIGHT = 'bottomRight',
  CENTERMIDDLE = 'centerMiddle',
  TOPMIDDLE = 'topMiddle',
  TOPRIGHT = 'topRight',
}

export interface GnroWindowConfig {
  title: string;
  showHeader: boolean;
  closable: Boolean;
  dragDisabled: boolean;
  maximizable: Boolean;
  resizeable: boolean;
  position?: GnroPositionType;
  width?: string;
  height?: string;
}

export const defaultWindowConfig: GnroWindowConfig = {
  title: '',
  showHeader: true,
  closable: true,
  dragDisabled: false,
  maximizable: true,
  resizeable: true,
  position: GnroPositionType.DEFAULT,
  width: '800px',
};

export interface GnroWindowInfo {
  top: number;
  left: number;
  width: number;
  height: number;
  isMaxWindowSize: boolean;
}
