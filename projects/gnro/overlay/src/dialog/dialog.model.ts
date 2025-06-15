import { InjectionToken, ElementRef, Injector } from '@angular/core';

export const GNRO_DIALOG_CONFIG = new InjectionToken<GnroDialogConfig>('Default dialog options');

export class GnroDialogConfig<D = {}> {
  hasBackdrop = true;
  backdropClass = 'cdk-overlay-dark-backdrop';
  closeOnBackdropClick = true;
  closeOnEsc = true;
  injector!: Injector;
  hostElemRef?: ElementRef;
  context!: D;

  constructor(config: Partial<GnroDialogConfig>) {
    Object.assign(this, config);
  }
}
