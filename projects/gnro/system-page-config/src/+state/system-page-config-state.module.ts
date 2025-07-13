import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GnroSystemPageConfigEffects } from './system-page-config.effects';

@NgModule({
  imports: [EffectsModule.forFeature([GnroSystemPageConfigEffects])],
})
export class GnroSystemPageConfigStateModule {}
