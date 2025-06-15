import { GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';
import { DxyPosition, GnroDashboardConfig, GnroTileResizeMap, GnroTile, GnroTileInfo } from '../models/dashboard.model';

export function tileResizeInfo<T>(
  resizeInfo: GnroResizeInfo,
  tile: GnroTile<T>,
  config: GnroDashboardConfig,
  gridMap: number[][],
): GnroTileInfo {
  const tileInfo: GnroTileInfo = {
    rowStart: tile.rowStart!,
    colStart: tile.colStart!,
    rowHeight: tile.rowHeight!,
    colWidth: tile.colWidth!,
  };
  let resizeMap: GnroTileResizeMap;
  let dxy: DxyPosition;
  let dx = Math.round(resizeInfo.dx / config.gridWidth);
  let dy = Math.round(resizeInfo.dy / config.gridHeight);

  switch (resizeInfo.direction) {
    case GnroResizeType.TOP:
      if (-dy >= tile.rowStart!) {
        dy = -tile.rowStart! + 1;
      } else if (dy >= tile.rowHeight!) {
        dy = tile.rowHeight! - 1;
      }
      resizeMap = {
        startRow: 0,
        endRow: tile.rowStart! - 1,
        startCol: tile.colStart! - 1,
        endCol: tile.colStart! - 1 + tile.colWidth!,
        colChange: 0,
        rowChange: -1,
      };
      dxy = getDxy(0, -dy, tile, resizeMap, gridMap);
      tileInfo.rowHeight += dxy.dy;
      tileInfo.rowStart -= dxy.dy;
      break;
    case GnroResizeType.TOP_RIGHT:
      if (-dy >= tile.rowStart!) {
        dy = -tile.rowStart! + 1;
      } else if (dy >= tile.rowHeight!) {
        dy = tile.rowHeight! - 1;
      }
      resizeMap = {
        startRow: dy < 0 ? 0 : tile.rowStart! - 1,
        endRow: dy < 0 ? tile.rowStart! - 1 : tile.rowStart! - 1 + tile.rowHeight!,
        startCol: tile.colStart! - 1,
        endCol: tile.colStart! - 1 + tile.colWidth! + Math.max(0, dx),
        colChange: 1,
        rowChange: dy < 0 ? -1 : 0,
      };
      dxy = getDxy(dx, -dy, tile, resizeMap, gridMap);
      tileInfo.rowHeight += dxy.dy;
      tileInfo.rowStart -= dxy.dy;
      tileInfo.colWidth += dxy.dx;
      break;
    case GnroResizeType.RIGHT:
    case GnroResizeType.BOTTOM_RIGHT:
      resizeMap = {
        startRow: tile.rowStart! - 1,
        endRow: dy > 0 ? config.rows : tile.rowStart! - 1 + tile.rowHeight!,
        startCol: tile.colStart! - 1,
        endCol: tile.colStart! - 1 + tile.colWidth! + Math.max(0, dx),
        colChange: 1,
        rowChange: dy > 0 ? 1 : 0,
      };
      dxy = getDxy(dx, dy, tile, resizeMap, gridMap);
      tileInfo.colWidth += dxy.dx;
      tileInfo.rowHeight += dxy.dy;
      break;
    case GnroResizeType.BOTTOM:
      resizeMap = {
        startRow: tile.rowStart! - 1 + tile.rowHeight!,
        endRow: config.rows,
        startCol: tile.colStart! - 1,
        endCol: tile.colStart! - 1 + tile.colWidth!,
        colChange: 0,
        rowChange: 1,
      };
      dxy = getDxy(0, dy, tile, resizeMap, gridMap);
      tileInfo.rowHeight += dxy.dy;
      break;
    case GnroResizeType.BOTTOM_LEFT:
      if (-dx >= tile.colStart!) {
        dx = -tile.colStart! + 1;
      }
      resizeMap = {
        startRow: tile.rowStart! - 1,
        endRow: dy > 0 ? config.rows : tile.rowStart! - 1 + tile.rowHeight!,
        startCol: dy > 0 ? tile.colStart! - 1 - Math.max(0, -dx) : 0,
        endCol: tile.colStart! - 1 + tile.colWidth!,
        colChange: -1,
        rowChange: dy > 0 ? 1 : 0,
      };
      dxy = getDxy(-dx, dy, tile, resizeMap, gridMap);
      if (tileInfo.colWidth + dxy.dx > 0) {
        tileInfo.rowHeight += dxy.dy;
        tileInfo.colWidth += dxy.dx;
        tileInfo.colStart -= dxy.dx;
      }
      break;
    case GnroResizeType.TOP_LEFT:
      if (-dx >= tile.colStart!) {
        dx = -tile.colStart! + 1;
      }
      if (-dy >= tile.rowStart!) {
        dy = -tile.rowStart! + 1;
      }
      resizeMap = {
        startRow: tile.rowStart! - 1 - Math.max(0, -dy),
        endRow: tile.rowStart! - 1 + tile.rowHeight!,
        startCol: tile.colStart! - 1 - Math.max(0, -dx),
        endCol: tile.colStart! - 1 + tile.colWidth!,
        colChange: -1,
        rowChange: -1,
      };
      dxy = getDxy(-dx, -dy, tile, resizeMap, gridMap);
      if (tileInfo.colWidth + dxy.dx > 0) {
        tileInfo.colWidth += dxy.dx;
        tileInfo.colStart -= dxy.dx;
        tileInfo.rowHeight += dxy.dy;
        tileInfo.rowStart -= dxy.dy;
      }
      break;
    case GnroResizeType.LEFT:
      if (-dx >= tile.colStart!) {
        dx = -tile.colStart! + 1;
      } else if (dx >= tile.colWidth!) {
        dx = tile.colWidth! - 1;
      }
      resizeMap = {
        startRow: tile.rowStart! - 1,
        endRow: tile.rowStart! - 1 + tile.rowHeight!,
        startCol: 0,
        endCol: tile.colStart! - 1 + tile.colWidth!,
        colChange: -1,
        rowChange: 0,
      };
      dxy = getDxy(-dx, 0, tile, resizeMap, gridMap);
      tileInfo.colWidth += dxy.dx;
      tileInfo.colStart -= dxy.dx;
      break;
  }
  return tileInfo;
}

function getDxy<T>(
  dx: number,
  dy: number,
  tile: GnroTile<T>,
  resizeMap: GnroTileResizeMap,
  tileGridMap: number[][],
): DxyPosition {
  const ret: DxyPosition = { dx: dx, dy: dy };
  const gridMap = tileGridMap
    .slice(resizeMap.startRow, resizeMap.endRow)
    .map((i) => i.slice(resizeMap.startCol, resizeMap.endCol));

  if (gridMap.length === 0) {
    return ret;
  }
  if (resizeMap.colChange !== 0) {
    const gmap: number[][] = gridMap.map((items, i) => {
      if (resizeMap.colChange < 0) {
        items.reverse();
      }
      return items
        .map((item, index) => {
          if (item >= 0 && item !== tile.index) {
            return index - tile.colWidth!;
          } else {
            return undefined;
          }
        })
        .filter((item) => item !== undefined);
    });
    ret.dx = Math.min(...([] as number[]).concat(...gmap), resizeMap.endCol - resizeMap.startCol, dx);
  }
  if (resizeMap.rowChange !== 0) {
    const tGridMap = gridMap[0].map((x, i) => gridMap.map((y) => y[i]));
    const gmap = tGridMap.map((items, i) => {
      if (resizeMap.rowChange < 0) {
        items.reverse();
      }
      return items
        .map((item, index) => {
          if (item >= 0 && item !== tile.index) {
            if (resizeMap.rowChange > 0 && resizeMap.colChange > 0) {
              return index - tile.colWidth!;
            } else {
              return index;
            }
          } else {
            return undefined;
          }
        })
        .filter((item) => item !== undefined);
    });
    ret.dy = Math.min(...([] as number[]).concat(...gmap), resizeMap.endRow - resizeMap.startRow, dy);
  }
  return ret;
}
