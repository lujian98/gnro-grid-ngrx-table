import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { GnroRemoteButtonsEffects } from './buttons.effects';
import { GnroRemoteExportsEffects } from './exports.effects';

@NgModule({
  imports: [GnroMessageStateModule, EffectsModule.forFeature([GnroRemoteButtonsEffects, GnroRemoteExportsEffects])],
})
export class GnroRemoteStateModule {}
