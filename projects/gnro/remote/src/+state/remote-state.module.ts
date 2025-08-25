import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { GnroRemoteButtonsEffects } from './buttons.effects';
import { GnroRemoteDeleteEffects } from './delete.effects';
import { GnroRemoteExportsEffects } from './exports.effects';
import { GnroRemoteImportsEffects } from './imports.effects';

@NgModule({
  imports: [
    GnroMessageStateModule,
    EffectsModule.forFeature([
      GnroRemoteDeleteEffects,
      GnroRemoteExportsEffects,
      GnroRemoteButtonsEffects,
      GnroRemoteImportsEffects,
    ]),
  ],
})
export class GnroRemoteStateModule {}
