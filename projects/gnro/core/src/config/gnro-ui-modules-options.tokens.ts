import { InjectionToken } from '@angular/core';

export interface GnroUIModulesOptions {
  backend: {
    baseUrl: string;
  };
}

export const GNRO_UI_MODULES_OPTIONS = new InjectionToken<GnroUIModulesOptions>('GNRO UI MODULES OPTIONS');
