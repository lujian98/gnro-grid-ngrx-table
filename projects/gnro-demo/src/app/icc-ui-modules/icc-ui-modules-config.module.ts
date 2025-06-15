import { NgModule } from '@angular/core';
import { ICC_UI_MODULES_OPTIONS } from '@icc/ui/core';
import { environment } from '../../environments/environment';

@NgModule({
  providers: [
    {
      provide: ICC_UI_MODULES_OPTIONS,
      useValue: {
        backend: { baseUrl: environment.backendBaseUrl },
      },
    },
  ],
})
export class IccUiModulesConfigModule {}
