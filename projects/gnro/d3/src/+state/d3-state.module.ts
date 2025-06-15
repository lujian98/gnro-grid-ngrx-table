import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroD3Effects } from './d3.effects';
import { GnroD3Facade } from './d3.facade';
import { gnroD3Feature } from './d3.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroD3Feature), EffectsModule.forFeature([GnroD3Effects])],
  providers: [GnroD3Facade],
})
export class GnroD3StateModule {}
