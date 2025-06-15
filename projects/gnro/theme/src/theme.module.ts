import { DOCUMENT } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { GNRO_DOCUMENT, GNRO_THEME_OPTIONS, GNRO_WINDOW, GnroThemeOptions } from './theme.options';
import { GnroThemeService } from './theme.service';

export function gnroWindowFactory() {
  return window;
}

@NgModule()
export class GnroThemeModule {
  static forRoot(gnroThemeOptions: GnroThemeOptions = { name: 'dark' }): ModuleWithProviders<GnroThemeModule> {
    return {
      ngModule: GnroThemeModule,
      providers: [
        { provide: GNRO_THEME_OPTIONS, useValue: gnroThemeOptions || {} },
        { provide: GNRO_WINDOW, useFactory: gnroWindowFactory },
        { provide: GNRO_DOCUMENT, useExisting: DOCUMENT },
        GnroThemeService,
      ],
    };
  }
}
