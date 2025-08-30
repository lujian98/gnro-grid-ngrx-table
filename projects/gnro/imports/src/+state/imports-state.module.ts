import { NgModule } from '@angular/core';
import { GnroMessageStateModule } from '@gnro/ui/message';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroRemoteImportsEffects } from './imports.effects';
import { gnroImportsFeature } from './imports.reducer';

@NgModule({
  imports: [
    GnroMessageStateModule,
    StoreModule.forFeature(gnroImportsFeature),
    EffectsModule.forFeature([GnroRemoteImportsEffects]),
  ],
})
export class GnroImportsStateModule {}
