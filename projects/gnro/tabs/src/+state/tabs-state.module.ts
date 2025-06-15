import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroTabsEffects } from './tabs.effects';
import { GnroTabsFacade } from './tabs.facade';
import { gnroTabsFeature } from './tabs.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroTabsFeature), EffectsModule.forFeature([GnroTabsEffects])],
  providers: [GnroTabsFacade],
})
export class GnroTabsStateModule {}
