import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { GnroSystemPageConfigEffects } from './system-page-config.effects';

@NgModule({
  imports: [GnroMessageStateModule, EffectsModule.forFeature([GnroSystemPageConfigEffects])],
})
export class GnroSystemPageConfigStateModule {}
