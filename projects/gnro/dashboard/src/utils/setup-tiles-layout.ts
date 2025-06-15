import { GnroDashboardConfig, GnroTile } from '../models/dashboard.model';

export function setupTilesLayout<T>(
  tiles: GnroTile<T>[],
  config: GnroDashboardConfig,
  gridMap: number[][],
): GnroTile<T>[] {
  return [...tiles].map((tile, index) => {
    tile.index = index;
    if (tile.colWidth! <= 0) {
      tile.colWidth = 1;
    }
    if (tile.rowHeight! <= 0) {
      tile.rowHeight = 1;
    }
    if (tile.colStart! <= 0) {
      tile.colStart = 1;
    }
    if (tile.rowStart! <= 0) {
      tile.rowStart = 1;
    }
    if (tile.rowStart! + tile.rowHeight! > config.rows) {
      tile.rowHeight = config.rows - tile.rowStart! + 1;
    }
    if (tile.colStart! + tile.colWidth! > config.cols) {
      tile.colWidth = config.cols - tile.colStart! + 1;
    }
    for (let j = tile.colStart! - 1; j < tile.colStart! + tile.colWidth! - 1; j++) {
      for (let i = tile.rowStart! - 1; i < tile.rowStart! + tile.rowHeight! - 1; i++) {
        gridMap[i][j] = index;
      }
    }
    tile.gridRow = `${tile.rowStart}/${tile.rowStart! + tile.rowHeight!}`;
    tile.gridColumn = `${tile.colStart}/${tile.colStart! + tile.colWidth!}`;

    if (!tile.content) {
      tile.content = tile.title || tile.name;
    }
    return { ...tile };
  });
}
