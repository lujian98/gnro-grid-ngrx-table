import { InjectionToken } from '@angular/core';

export interface AppRadioDefaultOptions {
  disabledInteractive?: boolean;
}

export const MAT_RADIO_DEFAULT_OPTIONS = new InjectionToken<AppRadioDefaultOptions>('mat-radio-default-options', {
  providedIn: 'root',
  factory: MAT_RADIO_DEFAULT_OPTIONS_FACTORY,
});

export function MAT_RADIO_DEFAULT_OPTIONS_FACTORY(): AppRadioDefaultOptions {
  return {
    disabledInteractive: false,
  };
}
