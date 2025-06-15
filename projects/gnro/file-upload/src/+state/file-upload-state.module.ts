import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroFileUploadEffects } from './file-upload.effects';
import { GnroFileUploadFacade } from './file-upload.facade';
import { gnroFileUploadFeature } from './file-upload.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroFileUploadFeature), EffectsModule.forFeature([GnroFileUploadEffects])],
  providers: [GnroFileUploadFacade],
})
export class GnroFileUploadStateModule {}
