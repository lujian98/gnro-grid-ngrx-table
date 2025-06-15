import { ModuleWithProviders, NgModule, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { gnroUiTranslations } from './assets/translations/translations';
import { GnroI18nService } from './i18n.service';

@NgModule()
export class GnroI18nModule {
  private translateService = inject(TranslateService);

  static forRoot(): ModuleWithProviders<GnroI18nModule> {
    return {
      ngModule: GnroI18nModule,
      providers: [GnroI18nService],
    };
  }

  constructor() {
    type LangKey = keyof typeof gnroUiTranslations;
    for (const key of Object.keys(gnroUiTranslations)) {
      this.translateService.setTranslation(key, gnroUiTranslations[key as LangKey]);
    }
  }
}
