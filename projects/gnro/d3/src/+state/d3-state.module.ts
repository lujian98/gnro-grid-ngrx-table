import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroD3Effects } from './d3.effects';
import { gnroD3Feature } from './d3.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroD3Feature), EffectsModule.forFeature([GnroD3Effects])],
})
export class GnroD3StateModule {}
