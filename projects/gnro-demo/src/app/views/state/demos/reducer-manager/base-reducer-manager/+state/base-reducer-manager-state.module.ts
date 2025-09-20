import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { BaseReducerManagerEffects } from './base-reducer-manager.effects';

@NgModule({
  imports: [EffectsModule.forFeature([BaseReducerManagerEffects])],
})
export class BaseReducerManagerStateModule {}
