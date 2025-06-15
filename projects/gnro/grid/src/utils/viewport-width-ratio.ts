import { GnroColumnConfig, GnroGridConfig, GnroGridSetting } from '../models/grid-column.model';
import { MIN_GRID_COLUMN_WIDTH, ROW_SELECTION_CELL_WIDTH } from '../models/constants';

export function viewportWidthRatio(
  gridConfig: GnroGridConfig,
  gridSetting: GnroGridSetting,
  columns: GnroColumnConfig[],
): number {
  if (gridConfig.horizontalScroll) {
    return 1.0;
  }
  const totalWidth = getTableWidth(columns);
  const viewportWidth = gridSetting.viewportWidth - (gridConfig.rowSelection ? ROW_SELECTION_CELL_WIDTH : 0);
  return viewportWidth / totalWidth;
}

export function getTableWidth(columns: GnroColumnConfig[]): number {
  return (
    [...columns]
      .filter((column) => !column.hidden)
      .map((column) => column.width || MIN_GRID_COLUMN_WIDTH)
      .reduce((prev, curr) => prev + curr, 0) || 1000
  );
}
