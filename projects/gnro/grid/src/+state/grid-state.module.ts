import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroGridEffects } from './grid.effects';
import { gnroGridFeature } from './grid.reducer';
import { GnroFormWindowStateModule } from '@gnro/ui/form-window';
import { GnroButtonStateModule } from '@gnro/ui/remote';

@NgModule({
  imports: [
    GnroButtonStateModule,
    GnroFormWindowStateModule,
    StoreModule.forFeature(gnroGridFeature),
    EffectsModule.forFeature([GnroGridEffects]),
  ],
})
export class GnroGridStateModule {}
