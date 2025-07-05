import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GnroBuildPageEffects } from './build-page.effects';

@NgModule({
  imports: [EffectsModule.forFeature([GnroBuildPageEffects])],
})
export class GnroBuildPageStateModule {}
