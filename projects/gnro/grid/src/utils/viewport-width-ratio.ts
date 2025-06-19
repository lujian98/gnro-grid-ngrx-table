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
  const totalWidth = getTableWidth(columns) - fiexWidth;
  const viewportWidth =
    gridSetting.viewportWidth - (gridConfig.rowSelection ? ROW_SELECTION_CELL_WIDTH : 0) - fiexWidth;
  console.log(' viewportWidth =', viewportWidth + fiexWidth);
  console.log(' ratio =', viewportWidth / totalWidth);
  return viewportWidth / totalWidth;
}

export function getTableFixedWidth(columns: GnroColumnConfig[]): number {
  return [...columns]
    .filter((column) => !column.hidden && column.resizeable === false)
    .map((column) => column.width || MIN_GRID_COLUMN_WIDTH)
    .reduce((prev, curr) => prev + curr, 0);
}

export function getTableWidth(columns: GnroColumnConfig[]): number {
  return [...columns]
    .filter((column) => !column.hidden)
    .map((column) => column.width || MIN_GRID_COLUMN_WIDTH)
    .reduce((prev, curr) => prev + curr, 0);
}
