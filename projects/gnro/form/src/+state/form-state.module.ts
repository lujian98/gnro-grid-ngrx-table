import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroFormEffects } from './form.effects';
import { GnroFormFacade } from './form.facade';
import { gnroFormFeature } from './form.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroFormFeature), EffectsModule.forFeature([GnroFormEffects])],
  providers: [GnroFormFacade],
})
export class GnroFormStateModule {}
