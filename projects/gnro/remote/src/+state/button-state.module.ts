import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { GnroButtonEffects } from './button.effects';

@NgModule({
  imports: [GnroMessageStateModule, EffectsModule.forFeature([GnroButtonEffects])],
})
export class GnroButtonStateModule {}
