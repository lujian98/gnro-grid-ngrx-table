import { InjectionToken } from '@angular/core';

export interface GnroRadioDefaultOptions {
  disabledInteractive?: boolean;
}

export const GNRO_RADIO_DEFAULT_OPTIONS = new InjectionToken<GnroRadioDefaultOptions>('gnro-radio-default-options', {
  providedIn: 'root',
  factory: GNRO_RADIO_DEFAULT_OPTIONS_FACTORY,
});

export function GNRO_RADIO_DEFAULT_OPTIONS_FACTORY(): GnroRadioDefaultOptions {
  return {
    disabledInteractive: false,
  };
}
