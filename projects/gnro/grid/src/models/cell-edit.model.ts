export interface GnroCellEditKey {
  rowIndex: number;
  colIndex: number;
  keyCode: number;
  direction: string;
}

export enum GnroKeyboard {
  ENTER = 13,
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  END = 35,
  HOME = 36,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,
}

export enum GnroDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  EXACT = 'exact',
}
