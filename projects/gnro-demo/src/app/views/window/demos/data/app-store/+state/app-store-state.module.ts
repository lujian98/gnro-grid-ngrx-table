import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppStoreEffects } from './app-store.effects';
import { BaseStoreState, initialState, baseStoreReducer } from '../../base-store';
import { appStoreFeature } from './app-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(appStoreFeature), EffectsModule.forFeature([AppStoreEffects])],
})
export class AppStoreStateModule {}
