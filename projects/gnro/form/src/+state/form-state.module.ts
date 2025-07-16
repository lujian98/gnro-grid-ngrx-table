import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroFormEffects } from './form.effects';
import { gnroFormFeature } from './form.reducer';

@NgModule({
  imports: [
    GnroMessageStateModule,
    StoreModule.forFeature(gnroFormFeature),
    EffectsModule.forFeature([GnroFormEffects]),
  ],
})
export class GnroFormStateModule {}
