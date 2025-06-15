import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroDashboardEffects } from './dashboard.effects';
import { GnroDashboardFacade } from './dashboard.facade';
import { gnroDashboardFeature } from './dashboard.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroDashboardFeature), EffectsModule.forFeature([GnroDashboardEffects])],
  providers: [GnroDashboardFacade],
})
export class GnroDashboardStateModule {}
