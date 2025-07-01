import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroGridEffects } from './grid.effects';
import { gnroGridFeature } from './grid.reducer';
import { GnroFormWindowStateModule } from '@gnro/ui/form-window';

@NgModule({
  imports: [
    GnroFormWindowStateModule,
    StoreModule.forFeature(gnroGridFeature),
    EffectsModule.forFeature([GnroGridEffects]),
  ],
})
export class GnroGridStateModule {}
