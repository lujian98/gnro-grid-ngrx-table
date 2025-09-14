import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppBaseStoreEffects } from './base-store.effects';
import { appBaseStoreFeature } from './base-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(appBaseStoreFeature), EffectsModule.forFeature([AppBaseStoreEffects])],
})
export class AppBaseStoreStateModule {}
