import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { GnroButtonConfg, GnroBUTTONS, uniqueId } from '@gnro/ui/core';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { GnroDashboardStateModule } from './+state/dashboard-state.module';
import { GnroDashboardFacade } from './+state/dashboard.facade';
import { GnroTilesComponent } from './components/tiles/tiles.component';
import {
  defaultDashboardConfig,
  defaultTileConfig,
  GnroDashboardConfig,
  GnroTile,
  GnroTileOption,
} from './models/dashboard.model';

@Component({
  selector: 'gnro-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    GnroDashboardStateModule,
    GnroTilesComponent,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
  ],
})
export class GnroDashboardComponent<T> implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly dashboardFacade = inject(GnroDashboardFacade);
  private readonly dashboardId = `dashbard-${uniqueId()}`;
  config$ = this.dashboardFacade.getDashboardConfig(this.dashboardId);
  setting$ = this.dashboardFacade.getSetting(this.dashboardId);
  tiles$ = this.dashboardFacade.getTiles(this.dashboardId);
  buttons: GnroButtonConfg[] = [GnroBUTTONS.Add, GnroBUTTONS.Remove];

  config = input.required({
    transform: (value: Partial<GnroDashboardConfig>) => {
      const config = { ...defaultDashboardConfig, ...value };
      this.dashboardFacade.setConfig(this.dashboardId, config);
      return config;
    },
  });
  options = input([], {
    transform: (options: GnroTileOption<T>[]) => {
      this.dashboardFacade.setOptions(this.dashboardId, options);
      return options;
    },
  });
  tiles = input([], {
    transform: (items: GnroTile<T>[]) => {
      const tiles = items.map((tile) => ({ ...defaultTileConfig, ...tile }));
      if (!this.config().remoteTiles) {
        this.dashboardFacade.setTiles(this.dashboardId, tiles);
      }
      return tiles;
    },
  });

  constructor() {
    this.dashboardFacade.initConfig(this.dashboardId, defaultDashboardConfig);
  }

  ngAfterViewInit(): void {
    this.setupGridViewport();
  }

  buttonClick(button: GnroButtonConfg): void {}

  private setupGridViewport(): void {
    const el = this.elementRef.nativeElement;
    const node = el.firstChild;
    if (node) {
      const width = node.clientWidth - 0; // - padding left/right,
      const height = node.clientHeight - 30;
      this.dashboardFacade.setGridViewport(this.dashboardId, width, height);
    }
  }

  ngOnDestroy(): void {
    this.dashboardFacade.clearStore(this.dashboardId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.setupGridViewport();
  }
}
