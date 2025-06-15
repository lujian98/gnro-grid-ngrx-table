import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { GNRO_DIALOG_CONFIG, GnroDialogConfig } from './dialog/dialog.model';
import { GnroDialogService } from './dialog/dialog.service';
import { GnroPositionBuilderService } from './overlay/overlay-position-builder.service';
import { GnroTriggerStrategyBuilderService } from './overlay/overlay-trigger';
import { GnroOverlay } from './overlay/overlay.models';
import { GnroOverlayService } from './overlay/overlay.service';

@NgModule({
  imports: [PortalModule],
  exports: [OverlayModule, PortalModule],
})
export class GnroOverlayModule {
  static forRoot(dialogConfig: Partial<GnroDialogConfig> = {}): ModuleWithProviders<GnroOverlayModule> {
    return {
      ngModule: GnroOverlayModule,
      providers: [
        GnroOverlayService,
        GnroOverlay,
        GnroPositionBuilderService,
        GnroTriggerStrategyBuilderService,
        GnroDialogService,
        { provide: GNRO_DIALOG_CONFIG, useValue: dialogConfig },
      ],
    };
  }
}
