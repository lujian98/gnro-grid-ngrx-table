export interface GnroResizeInfo {
  direction: string;
  element: HTMLDivElement;
  isResized: boolean;
  origin: string | null;
  width: number;
  height: number;
  dx: number;
  dy: number;
  scaleX: number;
  scaleY: number;
  signX: number;
  signY: number;
}

export interface GnroSize {
  height: number;
  width: number;
}

export enum GnroResizeType {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  TOP_LEFT = 'topLeft',
  TOP_RIGHT = 'topRight',
  BOTTOM_RIGHT = 'bottomRight',
  BOTTOM_LEFT = 'bottomLeft',
  TOP_BOTTOM = 'topBottom',
  BOTTOM_TOP = 'bottomTop',
  LEFT_RIGHT = 'leftRight',
  RIGHT_LEFT = 'rightLeft',
}
