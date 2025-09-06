import { CdkDragDrop, CdkDragHandle, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { GnroMenuConfig, GnroMenusComponent } from '@gnro/ui/menu';
import { GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverDirective } from '@gnro/ui/popover';
import { GnroPortalComponent, GnroPortalContent } from '@gnro/ui/portal';
import { GnroResizeDirective, GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';
import { GnroDashboardFacade } from '../../+state/dashboard.facade';
import { dragDropTile } from '../../utils/drag-drop-tile';
import { setupTilesLayout } from '../../utils/setup-tiles-layout';
import { tileResizeInfo } from '../../utils/tile-resize-info';
import { initGridMap } from '../../utils/viewport-setting';
import {
  defaultTileMenus,
  GnroDashboardConfig,
  GnroDashboardSetting,
  GnroTile,
  GnroTileOption,
} from './../../models/dashboard.model';

@Component({
  selector: 'gnro-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-gap]': 'gridGap',
    '[style.grid-template-columns]': 'setting().gridTemplateColumns',
    '[style.grid-template-rows]': 'setting().gridTemplateRows',
  },
  imports: [
    DragDropModule,
    CdkDragHandle,
    GnroPortalComponent,
    GnroMenusComponent,
    GnroPopoverDirective,
    GnroResizeDirective,
  ],
})
export class GnroTilesComponent<T> implements OnInit {
  private readonly dashboardFacade = inject(GnroDashboardFacade);
  resizeType = GnroResizeType;
  position: GnroPosition = GnroPosition.BOTTOMRIGHT;
  tileMenus = defaultTileMenus;

  prevConfig = signal<GnroDashboardConfig | undefined>(undefined);
  config = input.required({
    transform: (config: GnroDashboardConfig) => {
      if (this.prevConfig() && (config.rows !== this.prevConfig()!.rows || config.cols !== this.prevConfig()!.cols)) {
        this.setupTilesLayout(this.tiles()); //TODO test confg change
      }
      this.prevConfig.update(() => config);
      return config;
    },
  });
  setting = input.required<GnroDashboardSetting>();
  tiles = input.required<GnroTile<T>[]>();
  options = input<GnroTileOption<T>[]>([]);

  get gridGap(): string {
    return `${this.config().gridGap}px`;
  }

  ngOnInit(): void {
    this.setupTilesLayout(this.tiles());
  }

  getPortalContent(tile: GnroTile<T>): GnroPortalContent<T> {
    const find = this.options().find((option) => option.name === tile.portalName);
    return find ? find.content : tile.content!;
  }

  getContextMenuTrigger(tile: GnroTile<T>): GnroTrigger {
    return tile.enableContextMenu ? GnroTrigger.CONTEXTMENU : GnroTrigger.NOOP;
  }

  onTileMenuClicked(tileMenu: GnroMenuConfig, tile: GnroTile<T>): void {}

  onResizeTile(resizeInfo: GnroResizeInfo, tile: GnroTile<T>): void {
    if (resizeInfo.isResized) {
      const tileInfo = tileResizeInfo(resizeInfo, tile, this.config(), this.setting().gridMap);
      Object.assign(tile, tileInfo);
      this.setupTilesLayout(this.tiles());
      window.dispatchEvent(new Event('resize'));
    }
  }

  isDragDisabled(tile: GnroTile<T>): boolean {
    return !!tile.dragDisabled;
  }

  onDropListDropped<D>(e: CdkDragDrop<D>, tile: GnroTile<T>): void {
    const newTiles = dragDropTile(e, tile, this.tiles(), this.config(), this.setting().gridMap);
    this.setupTilesLayout(newTiles);
  }

  private setupTilesLayout(tiles: GnroTile<T>[]): void {
    const gridMap = initGridMap(this.config()); //WARNING initialize gridMap!!!
    const newTiles = setupTilesLayout(tiles, this.config(), gridMap);
    this.dashboardFacade.loadGridMapTiles(this.setting().dashboardId, gridMap, newTiles);
  }
}
