import { InjectionToken } from '@angular/core';

export interface GnroThemeOptions {
  name: string;
}
export const GNRO_THEME_OPTIONS = new InjectionToken<GnroThemeOptions>('Gnro Theme Options');
export const GNRO_WINDOW = new InjectionToken<Window>('Window');
export const GNRO_DOCUMENT = new InjectionToken<Document>('Document');
