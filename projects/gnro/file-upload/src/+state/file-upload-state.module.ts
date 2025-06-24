import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GnroFileUploadEffects } from './file-upload.effects';
import { gnroFileUploadFeature } from './file-upload.reducer';

@NgModule({
  imports: [StoreModule.forFeature(gnroFileUploadFeature), EffectsModule.forFeature([GnroFileUploadEffects])],
})
export class GnroFileUploadStateModule {}
