import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GnroMessageEffects } from './message.effects';

@NgModule({
  imports: [EffectsModule.forFeature([GnroMessageEffects])],
})
export class GnroMessageStateModule {}
