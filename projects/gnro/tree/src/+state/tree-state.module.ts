import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroTreeEffects } from './tree.effects';
import { gnroTreeFeature } from './tree.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroTreeFeature), EffectsModule.forFeature([GnroTreeEffects])],
})
export class GnroTreeStateModule {}
