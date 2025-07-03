import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroFormWindowEffects } from './form-window.effects';
import { gnroFormWindowFeature } from './form-window.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroFormWindowFeature), EffectsModule.forFeature([GnroFormWindowEffects])],
})
export class GnroFormWindowStateModule {}
