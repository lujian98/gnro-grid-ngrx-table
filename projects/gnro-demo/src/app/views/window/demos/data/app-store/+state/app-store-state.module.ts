import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppStoreEffects } from './app-store.effects';
import { appStoreFeature } from './app-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(appStoreFeature), EffectsModule.forFeature([AppStoreEffects])],
})
export class AppStoreStateModule {} //need provide AppStoreStateModule to the hightest use app-base-store-
