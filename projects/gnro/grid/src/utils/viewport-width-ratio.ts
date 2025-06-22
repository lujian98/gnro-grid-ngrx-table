import { GnroColumnConfig, GnroGridConfig, GnroGridSetting } from '../models/grid.model';
import { MIN_GRID_COLUMN_WIDTH, ROW_SELECTION_CELL_WIDTH } from '../models/constants';

export function viewportWidthRatio(
  gridConfig: GnroGridConfig,
  gridSetting: GnroGridSetting,
  columns: GnroColumnConfig[],
): number {
  if (gridConfig.horizontalScroll) {
    return 1.0;
  }
  const fiexWidth = getTableFixedWidth(columns);
  const totalWidth = getTableWidth(columns, gridConfig) - fiexWidth;
  const width = gridSetting.viewportWidth - (gridConfig.rowSelection ? ROW_SELECTION_CELL_WIDTH : 0) - fiexWidth;
  return width / totalWidth;
}

export function getTableFixedWidth(columns: GnroColumnConfig[]): number {
  return [...columns]
    .filter((column) => !column.hidden && column.resizeable === false)
    .map((column) => column.width || MIN_GRID_COLUMN_WIDTH)
    .reduce((prev, curr) => prev + curr, 0);
}

export function getTableWidth(columns: GnroColumnConfig[], gridConfig: GnroGridConfig): number {
  const initWidth = gridConfig.rowSelection ? ROW_SELECTION_CELL_WIDTH : 0; // gridConfig.horizontalScroll &&
  return [...columns]
    .filter((column) => !column.hidden)
    .map((column) => column.width || MIN_GRID_COLUMN_WIDTH)
    .reduce((prev, curr) => prev + curr, initWidth);
}

export function getColumnsWidth(columns: GnroColumnConfig[], selection: boolean): number {
  return [...columns]
    .filter((column) => !column.hidden)
    .map((column) => column.width!)
    .reduce((prev, curr) => prev + curr, selection ? ROW_SELECTION_CELL_WIDTH : 0);
}

export function stickyEndMinWidth(
  columns: GnroColumnConfig[],
  gridConfig: GnroGridConfig,
  gridSetting: GnroGridSetting,
): GnroColumnConfig[] {
  if (gridConfig.horizontalScroll) {
    const stickyEnd = [...columns].filter((col) => col.stickyEnd).length;
    const width = getTableWidth(columns, gridConfig);
    if (stickyEnd > 0 && width < gridSetting.viewportWidth) {
      const calRatio = (gridSetting.viewportWidth + 50) / width;
      const adjColumns: GnroColumnConfig[] = [...columns].map((column, index) => {
        const resizeable = columns.find((col) => col.name === column.name)?.resizeable;
        const ratio = resizeable === false ? 1 : calRatio;
        return {
          ...column,
          width: columns[index].width! * ratio,
        };
      });
      return adjColumns;
    }
  }
  return columns;
}
