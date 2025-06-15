import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ClassProvider, Inject, Injectable, Injector, TemplateRef, Type, inject } from '@angular/core';
import { GnroPortalComponent } from '@gnro/ui/portal';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { GnroOverlayRef } from '../overlay/overlay.models';
import { GnroOverlayService } from '../overlay/overlay.service';
import { GnroDialogRef } from './dialog-ref';
import { GNRO_DIALOG_CONFIG, GnroDialogConfig } from './dialog.model';

@Injectable()
export class GnroDialogService {
  private readonly overlayService = inject(GnroOverlayService);
  private readonly injector = inject(Injector);

  constructor(
    @Inject(GNRO_DOCUMENT) private document: Document,
    @Inject(GNRO_DIALOG_CONFIG) private globalConfig: GnroDialogConfig,
  ) {}

  open<T>(
    content: Type<T> | TemplateRef<T>,
    userConfig: Partial<GnroDialogConfig<Partial<T> | string>> = {},
    provides: ClassProvider[] = [],
  ): GnroDialogRef<T> {
    const config = new GnroDialogConfig({ ...this.globalConfig, ...userConfig });
    const overlayRef = this.createOverlay(config);
    const dialogRef = new GnroDialogRef<T>(overlayRef);
    const injector = Injector.create({
      parent: userConfig.injector || this.injector,
      providers: [
        ...provides,
        { provide: OverlayRef, useValue: overlayRef },
        { provide: GnroDialogRef, useValue: dialogRef },
        { provide: GNRO_DIALOG_CONFIG, useValue: config },
      ],
    });
    const portal = this.createContainer(overlayRef, injector);
    this.createContent(config, content, portal, dialogRef, injector);
    this.registerCloseListeners(config, overlayRef, dialogRef);
    return dialogRef;
  }

  private createOverlay(config: GnroDialogConfig): GnroOverlayRef {
    return this.overlayService.create({
      positionStrategy: this.overlayService.getPositionStrategy(config.hostElemRef),
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
    });
  }

  private createContainer<T>(overlayRef: GnroOverlayRef, injector: Injector): GnroPortalComponent<T> {
    const containerPortal = new ComponentPortal(GnroPortalComponent, null, injector);
    const containerRef = overlayRef.attach(containerPortal);
    return containerRef.instance as GnroPortalComponent<T>;
  }

  private createContent<T>(
    config: GnroDialogConfig,
    content: Type<T> | TemplateRef<T>,
    portal: GnroPortalComponent<T>,
    dialogRef: GnroDialogRef<T>,
    injector: Injector,
  ) {
    if (content instanceof TemplateRef) {
      portal.createTemplatePortal(content, {
        $implicit: config.context,
        dialogRef,
      });
    } else {
      dialogRef.componentRef = portal.createComponentPortal(content, config.context, injector);
    }
  }

  private registerCloseListeners<T>(config: GnroDialogConfig, overlayRef: GnroOverlayRef, dialogRef: GnroDialogRef<T>) {
    if (config.closeOnBackdropClick) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
    }
    if (config.closeOnEsc) {
      fromEvent(this.document, 'keyup')
        .pipe(
          filter((event: Event) => (event as KeyboardEvent).code === 'Escape'),
          takeUntil(dialogRef.onClose),
        )
        .subscribe(() => dialogRef.close());
    }
  }
}
