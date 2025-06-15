import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroGridEffects } from './grid.effects';
import { GnroGridFacade } from './grid.facade';
import { gnroGridFeature } from './grid.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroGridFeature), EffectsModule.forFeature([GnroGridEffects])],
  providers: [GnroGridFacade],
})
export class GnroGridStateModule {}
