import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BaseReducerManagerEffects } from './base-reducer-manager.effects';
import { baseReducerManagerFeature } from './base-reducer-manager.reducer';

@NgModule({
  imports: [StoreModule.forFeature(baseReducerManagerFeature), EffectsModule.forFeature([BaseReducerManagerEffects])],
})
export class BaseReducerManagerStateModule {}
