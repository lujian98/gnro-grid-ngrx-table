import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { GnroDashboardConfig, GnroTile } from '../models/dashboard.model';

export function dragDropTile<D, T>(
  e: CdkDragDrop<D>,
  tile: GnroTile<T>,
  tiles: GnroTile<T>[],
  config: GnroDashboardConfig,
  gridMap: number[][],
): GnroTile<T>[] {
  const draggedTile = tiles[e.item.data];
  const dx = Math.round(e.distance.x / config.gridWidth);
  const dy = Math.round(e.distance.y / config.gridHeight);
  const x = Math.min(Math.max(draggedTile.colStart! + dx, 1), config.cols);
  const y = Math.min(Math.max(draggedTile.rowStart! + dy, 1), config.rows);
  const xyState = gridMap[y - 1][x - 1];
  // if drop into empty space check if tile will cover other tile
  if (e.item.data === tile.index || xyState < 0) {
    if (
      isDroppable(x, y, draggedTile, tile.index!, config, gridMap) &&
      isDroppable(x, y, draggedTile, -1, config, gridMap)
    ) {
      draggedTile.colStart = x;
      draggedTile.rowStart = y;
    }
  } else {
    // if drop into other tile(s)
    tile = tiles[xyState];
    if (
      isDroppable(tile.colStart! + draggedTile.colWidth!, tile.rowStart!, tile, draggedTile.index!, config, gridMap) &&
      isDroppable(tile.colStart!, tile.rowStart!, draggedTile, tile.index!, config, gridMap)
    ) {
      draggedTile.colStart = tile.colStart;
      draggedTile.rowStart = tile.rowStart;
      tile.colStart = draggedTile.colStart! + draggedTile.colWidth!;
    }
  }
  return tiles;
}

function isDroppable<T>(
  x: number,
  y: number,
  tile: GnroTile<T>,
  index: number,
  config: GnroDashboardConfig,
  tileGridMap: number[][],
): boolean {
  if (x <= config.cols && y <= config.rows) {
    const gridMap = tileGridMap
      .slice(y - 1, y - 1 + tile.rowHeight!)
      .map((i) => i.slice(x - 1, x - 1 + tile.colWidth!));

    const gmap = gridMap.map((items, i) => {
      return items
        .map((item) => {
          if (item >= 0 && item !== tile.index) {
            if ((index !== -1 && item !== index) || index === -1) {
              return item;
            }
          }
          return undefined;
        })
        .filter((item) => item !== undefined)
        .concat();
    });
    return Math.max(...([] as number[]).concat(...gmap), -1) === -1;
  }
  return false;
}
