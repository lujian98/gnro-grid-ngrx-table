import { NgModule } from '@angular/core';
import { GNRO_UI_MODULES_OPTIONS } from '@gnro/ui/core';
import { environment } from '../../environments/environment';

@NgModule({
  providers: [
    {
      provide: GNRO_UI_MODULES_OPTIONS,
      useValue: {
        backend: { baseUrl: environment.backendBaseUrl },
      },
    },
  ],
})
export class GnroUiModulesConfigModule {}
