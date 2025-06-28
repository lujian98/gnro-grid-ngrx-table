export interface GnroWindowConfig {
  title: string;
  showHeader: boolean;
  closable: Boolean;
  dragDisabled: boolean;
  maximizable: Boolean;
  resizeable: boolean;
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
  width: '800px',
};

export interface GnroWindowInfo {
  top: number;
  left: number;
  width: number;
  height: number;
}
