import { ElementRef, inject } from '@angular/core';
import { DEFAULT_OVERLAY_SERVICE_CONFIG, GnroOverlayServiceConfig, GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverComponent, GnroPopoverService } from '@gnro/ui/popover';
import * as d3Dispatch from 'd3-dispatch';
import { GnroD3PopoverComponent } from '../components/popover/popover.component';
import { GnroAbstractDraw } from '../draws';

export class GnroD3Dispatch<T> {
  private readonly popoverService = inject(GnroPopoverService);
  private readonly elementRef = inject(ElementRef);
  dispatch: d3Dispatch.Dispatch<{}> = d3Dispatch.dispatch(
    'drawMouseover',
    'drawMouseout',
    'drawZoom',
    'legendClick',
    'legendResize',
    'legendMouseover',
    'legendMouseout',
    'stateChange',
  );
  draws: GnroAbstractDraw<T>[] = [];

  setDispatch(): void {
    this.dispatch.on('legendClick', (d: any) => {
      this.legendMouseover(d, !d.disabled);
      this.legendMouseover(d, !d.disabled);
    });
    this.dispatch.on('legendMouseover', (d: any) => this.legendMouseover(d, true));
    this.dispatch.on('legendMouseout', (d: any) => this.legendMouseover(d, false));
    this.dispatch.on('drawMouseover', (p: any) => {
      this.hidePopover();
      if (p.data && p.data.series.length > 0) {
        const popoverContext = { data: p.data };
        this.buildPopover(popoverContext, p.event);
      }
    });
    this.dispatch.on('drawMouseout', (p: any) => {
      this.hidePopover(); // NOT WORKING
    });
  }

  private legendMouseover(data: T[], mouseover: boolean): void {
    this.draws.forEach((draw: GnroAbstractDraw<T>) => draw.legendMouseover(null, data, mouseover));
  }

  private buildPopover(popoverContext: Object, event: MouseEvent): void {
    const overlayServiceConfig: GnroOverlayServiceConfig = {
      ...DEFAULT_OVERLAY_SERVICE_CONFIG,
      trigger: GnroTrigger.POINT,
      position: GnroPosition.BOTTOMRIGHT,
      event,
    };
    this.popoverService.build(
      GnroPopoverComponent,
      this.elementRef,
      overlayServiceConfig,
      GnroD3PopoverComponent,
      popoverContext,
    );
    this.showPopover();
  }

  private showPopover(): void {
    this.hidePopover();
    this.popoverService.show();
  }

  hidePopover(): void {
    this.popoverService.hide();
  }
}
