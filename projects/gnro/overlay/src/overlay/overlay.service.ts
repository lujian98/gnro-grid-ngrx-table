import { GlobalPositionStrategy, PositionStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ElementRef, Injectable, inject } from '@angular/core';
import { GnroOverlay, GnroOverlayConfig, GnroOverlayItem, GnroOverlayRef } from './overlay.models';

@Injectable()
export class GnroOverlayService {
  private readonly overlay = inject(GnroOverlay);
  private _overlays: GnroOverlayItem[] = [];

  get scrollStrategies(): ScrollStrategyOptions {
    return this.overlay.scrollStrategies;
  }

  getPositionStrategy(hostElemRef?: ElementRef): PositionStrategy {
    if (!hostElemRef) {
      return new GlobalPositionStrategy().centerHorizontally().centerVertically();
    } else {
      return this.overlay
        .position()
        .flexibleConnectedTo(hostElemRef)
        .withFlexibleDimensions(true)
        .withViewportMargin(8)
        .withDefaultOffsetY(2)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]);
    }
  }

  create(config?: GnroOverlayConfig): GnroOverlayRef {
    const overlayRef = this.overlay.create(config);
    return overlayRef;
  }

  set overlays(val: GnroOverlayItem[]) {
    this._overlays = val;
  }
  get overlays(): GnroOverlayItem[] {
    return this._overlays;
  }

  add(overlayRef: GnroOverlayRef, level: number): void {
    this.overlays = [...this.overlays].filter((item) => item.level < level);
    const overlay = { level, overlayRef };
    this.overlays = level < 1 ? [overlay] : [...this.overlays, overlay];
  }

  remove(overlayRef: GnroOverlayRef | null): void {
    if (overlayRef) {
      this.overlays = this.overlays.filter((item) => item.overlayRef !== overlayRef);
    }
  }

  isOverlayColasable(popoverLevel: number): boolean {
    const find = this.overlays.filter((item) => item.level > popoverLevel).length;
    return find === 0 ? true : false;
  }
}
