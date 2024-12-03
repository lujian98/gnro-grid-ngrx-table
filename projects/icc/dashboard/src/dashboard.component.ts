import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { IccMenuItem, IccMenusComponent, IccPopoverMenuComponent } from '@icc/ui/menu';
import { IccPanelComponent } from '@icc/ui/panel';
import { IccPortalComponent } from '@icc/ui/portal';
import { IccResizeDirective, IccResizeInfo } from '@icc/ui/resize';
import { DxyPosition, ResizeMap, Tile, TileInfo } from './model';

@Component({
  selector: 'icc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    IccPortalComponent,
    IccPanelComponent,
    IccResizeDirective,
    IccPopoverMenuComponent,
    IccMenusComponent,
  ],
})
export class IccDashboardComponent<T> implements AfterViewInit, OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  @Input() tiles: Tile<T>[] = [];
  @Input() gridGap = 2;
  @Input() gridWidth = 100;
  @Input() gridHeight = 100;
  @Input() cols = 10;
  @Input() rows = 6;
  private gridMap: number[][] = [];
  menuItems!: IccMenuItem;

  gridTemplateColumns!: string;
  gridTemplateRows!: string;

  ngOnInit(): void {
    this.setGridTemplate();
    this.setTileLayouts();
  }

  ngAfterViewInit(): void {
    this.setSideMenu();
    this.setupGrid();
  }

  setSideMenu(): void {
    const sideMenu = [];
    sideMenu.push({ title: 'Refresh', name: 'Refresh', icon: 'refresh' });
    this.menuItems = {
      name: 'dashboard',
      title: 'dashboard',
      icon: 'fas fa-ellipsis-v',
      children: sideMenu,
    };
  }

  private setupGrid(): void {
    // TODO should this be this.elementRef.nativeElement.parentNode or this.elementRef.nativeElement???
    //console.log(' this =', this);
    const size = this.getDashboardSize()!;
    //console.log(' 3333333333 size =', size);
    this.gridWidth = (size.width - this.cols * this.gridGap - 4) / this.cols;
    this.gridHeight = (size.height - this.cols * this.gridGap - 4) / this.rows;
    this.setGridTemplate();
    this.changeDetectorRef.detectChanges();
  }

  private getDashboardSize() {
    // TODO return correct size
    const el = this.elementRef.nativeElement;
    let node = null;
    //console.log(' this.elementRef=', this.elementRef);
    //console.log(' el.clientWidth=', el.clientWidth);
    //console.log(' el.firstChild.clientWidth=', el.firstChild.clientWidth);
    //console.log(' el.parentNode.parentNode.clientWidth=', el.parentNode.parentNode.clientWidth);

    /*
    if (el.clientWidth) {
      node = el;
    } else if (el.parentNode.clientWidth) {
      node = el.parentNode;
    } else if (el.parentNode.parentNode.clientWidth) {
      node = el.parentNode.parentNode;
    } */
    node = el.firstChild;
    if (node) {
      return {
        width: node.clientWidth,
        height: node.clientHeight,
      };
    }
    return null;
  }

  private setGridTemplate(): void {
    this.gridTemplateColumns = `repeat(${this.cols}, ${this.gridWidth}px)`;
    this.gridTemplateRows = `repeat(${this.rows}, ${this.gridHeight}px)`;
  }

  private setTileLayouts(): void {
    for (let i = 0; i < this.rows; i++) {
      this.gridMap[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.gridMap[i][j] = -1;
      }
    }
    this.tiles.forEach((tile, index) => {
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
      if (tile.rowStart! + tile.rowHeight! > this.rows) {
        tile.rowHeight = this.rows - tile.rowStart! + 1;
      }
      if (tile.colStart! + tile.colWidth! > this.cols) {
        tile.colWidth = this.cols - tile.colStart! + 1;
      }
      for (let j = tile.colStart! - 1; j < tile.colStart! + tile.colWidth! - 1; j++) {
        for (let i = tile.rowStart! - 1; i < tile.rowStart! + tile.rowHeight! - 1; i++) {
          this.gridMap[i][j] = index;
        }
      }
      tile.gridRow = `${tile.rowStart}/${tile.rowStart! + tile.rowHeight!}`;
      tile.gridColumn = `${tile.colStart}/${tile.colStart! + tile.colWidth!}`;

      if (!tile.content) {
        tile.content = tile.title || tile.name;
      }
    });
    //console.log(' this.tiles =', this.tiles);
    //console.log(' this.gridMap =', this.gridMap);
  }

  onResizeTile(resizeInfo: IccResizeInfo, tile: Tile<T>): void {
    //console.log(' resizeInfo=', resizeInfo);
    if (resizeInfo.isResized) {
      // const element = resizeInfo.element;
      // element.style.transform = '';
      // element.style['transform-origin'] = '';
      const tileInfo = this.getResizeTileInfo(resizeInfo, tile);
      Object.assign(tile, tileInfo);
      this.setTileLayouts();
    }
    /*
    if (!resizeInfo.isResized) {
      element.style['transform-origin'] = resizeInfo.origin;
      element.style.transform = `scale(${resizeInfo.scaleX}, ${resizeInfo.scaleY})`;
    } else {
      element.style.transform = '';
      const tileInfo = this.getResizeTileInfo(resizeInfo, tile);
      Object.assign(tile, tileInfo);
      this.setTileLayouts();
    } */
  }

  private getResizeTileInfo(resizeInfo: IccResizeInfo, tile: Tile<T>): TileInfo {
    const tileInfo: TileInfo = {
      rowStart: tile.rowStart!,
      colStart: tile.colStart!,
      rowHeight: tile.rowHeight!,
      colWidth: tile.colWidth!,
    };
    let resizeMap: ResizeMap;
    let dxy: DxyPosition;
    let dx = Math.round(resizeInfo.dx / this.gridWidth);
    let dy = Math.round(resizeInfo.dy / this.gridHeight);
    //console.log(' dx =', dx, ' resizeInfo =', resizeInfo, ' this.gridWidth=', this.gridWidth);

    switch (resizeInfo.direction) {
      case 'top':
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
        dxy = this.getDxy(0, -dy, tile, resizeMap);
        tileInfo.rowHeight += dxy.dy;
        tileInfo.rowStart -= dxy.dy;
        break;
      case 'topRight':
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
        dxy = this.getDxy(dx, -dy, tile, resizeMap);
        tileInfo.rowHeight += dxy.dy;
        tileInfo.rowStart -= dxy.dy;
        tileInfo.colWidth += dxy.dx;
        break;
      case 'right':
      case 'bottomRight':
        resizeMap = {
          startRow: tile.rowStart! - 1,
          endRow: dy > 0 ? this.rows : tile.rowStart! - 1 + tile.rowHeight!,
          startCol: tile.colStart! - 1,
          endCol: tile.colStart! - 1 + tile.colWidth! + Math.max(0, dx),
          colChange: 1,
          rowChange: dy > 0 ? 1 : 0,
        };
        dxy = this.getDxy(dx, dy, tile, resizeMap);
        tileInfo.colWidth += dxy.dx;
        tileInfo.rowHeight += dxy.dy;
        break;
      case 'bottom':
        resizeMap = {
          startRow: tile.rowStart! - 1 + tile.rowHeight!,
          endRow: this.rows,
          startCol: tile.colStart! - 1,
          endCol: tile.colStart! - 1 + tile.colWidth!,
          colChange: 0,
          rowChange: 1,
        };
        dxy = this.getDxy(0, dy, tile, resizeMap);
        tileInfo.rowHeight += dxy.dy;
        break;
      case 'bottomLeft':
        if (-dx >= tile.colStart!) {
          dx = -tile.colStart! + 1;
        }
        resizeMap = {
          startRow: tile.rowStart! - 1,
          endRow: dy > 0 ? this.rows : tile.rowStart! - 1 + tile.rowHeight!,
          startCol: dy > 0 ? tile.colStart! - 1 - Math.max(0, -dx) : 0,
          endCol: tile.colStart! - 1 + tile.colWidth!,
          colChange: -1,
          rowChange: dy > 0 ? 1 : 0,
        };
        dxy = this.getDxy(-dx, dy, tile, resizeMap);
        if (tileInfo.colWidth + dxy.dx > 0) {
          tileInfo.rowHeight += dxy.dy;
          tileInfo.colWidth += dxy.dx;
          tileInfo.colStart -= dxy.dx;
        }
        break;
      case 'topLeft':
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
        dxy = this.getDxy(-dx, -dy, tile, resizeMap);
        if (tileInfo.colWidth + dxy.dx > 0) {
          tileInfo.colWidth += dxy.dx;
          tileInfo.colStart -= dxy.dx;
          tileInfo.rowHeight += dxy.dy;
          tileInfo.rowStart -= dxy.dy;
        }
        break;
      case 'left':
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
        dxy = this.getDxy(-dx, 0, tile, resizeMap);
        tileInfo.colWidth += dxy.dx;
        tileInfo.colStart -= dxy.dx;
        break;
    }
    return tileInfo;
  }

  private getDxy(dx: number, dy: number, tile: Tile<T>, resizeMap: ResizeMap): DxyPosition {
    const ret: DxyPosition = { dx: dx, dy: dy };
    const gridMap = this.gridMap
      .slice(resizeMap.startRow, resizeMap.endRow)
      .map((i) => i.slice(resizeMap.startCol, resizeMap.endCol));
    if (gridMap.length === 0) {
      return ret;
    }
    if (resizeMap.colChange !== 0) {
      const gmap = gridMap.map((items, i) => {
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
      // @ts-ignore
      ret.dx = Math.min(...[].concat(...gmap), resizeMap.endCol - resizeMap.startCol, dx);
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
      // @ts-ignore
      ret.dy = Math.min(...[].concat(...gmap), resizeMap.endRow - resizeMap.startRow, dy);
    }
    return ret;
  }

  isDragDisabled(tile: Tile<T>): boolean {
    // TODO not used yet
    return false;
  }

  onDropListDropped<D>(e: CdkDragDrop<D>, tile: Tile<T>): void {
    const draggedTile = this.tiles[e.item.data];
    const dx = Math.round(e.distance.x / this.gridWidth);
    const dy = Math.round(e.distance.y / this.gridHeight);
    const x = Math.min(Math.max(draggedTile.colStart! + dx, 1), this.cols);
    const y = Math.min(Math.max(draggedTile.rowStart! + dy, 1), this.rows);
    const xyState = this.gridMap[y - 1][x - 1];
    // if drop into empty space check if tile will cover any other tile
    if (e.item.data === tile.index || xyState < 0) {
      if (this.isDroppable(x, y, draggedTile, tile.index!) && this.isDroppable(x, y, draggedTile, -1)) {
        draggedTile.colStart = x;
        draggedTile.rowStart = y;
      }
    } else {
      // if drop into other tile(s)
      tile = this.tiles[xyState];
      if (
        this.isDroppable(tile.colStart! + draggedTile.colWidth!, tile.rowStart!, tile, draggedTile.index!) &&
        this.isDroppable(tile.colStart!, tile.rowStart!, draggedTile, tile.index!)
      ) {
        draggedTile.colStart = tile.colStart;
        draggedTile.rowStart = tile.rowStart;
        tile.colStart = draggedTile.colStart! + draggedTile.colWidth!;
      }
    }
    this.setTileLayouts();
  }

  private isDroppable(x: number, y: number, tile: Tile<T>, index: number): boolean {
    if (x <= this.cols && y <= this.rows) {
      const gridMap = this.gridMap
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
      // @ts-ignore
      return Math.max(...[].concat(...gmap), -1) === -1;
    }
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent) {
    this.setupGrid();
  }
}
