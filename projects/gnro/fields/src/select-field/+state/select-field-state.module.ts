import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroSelectFieldEffects } from './select-field.effects';
import { gnroSelectFieldFeature } from './select-field.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroSelectFieldFeature), EffectsModule.forFeature([GnroSelectFieldEffects])],
})
export class GnroSelectFieldStateModule {}
