import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { GnroPosition } from './overlay-position';
import { GnroTrigger } from './overlay-trigger';

@Injectable()
export class GnroOverlay extends Overlay {}

export type GnroOverlayRef = OverlayRef;
export type GnroOverlayConfig = OverlayConfig;

export interface GnroOverlayServiceConfig {
  position: GnroPosition;
  popoverLevel?: number;
  trigger: GnroTrigger;
  clickToClose: boolean;
  customStyle?: string | undefined;
  event?: MouseEvent;
}

export const DEFAULT_OVERLAY_SERVICE_CONFIG: GnroOverlayServiceConfig = {
  position: GnroPosition.BOTTOM,
  popoverLevel: 0,
  trigger: GnroTrigger.CLICK,
  clickToClose: false,
};

export interface GnroOverlayItem {
  level: number;
  overlayRef: GnroOverlayRef;
}
