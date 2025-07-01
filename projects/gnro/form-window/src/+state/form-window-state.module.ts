import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GnroFormWindowEffects } from './form-window.effects';

@NgModule({
  imports: [EffectsModule.forFeature([GnroFormWindowEffects])],
})
export class GnroFormWindowStateModule {}
