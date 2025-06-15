import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { GNRO_DOCUMENT, GNRO_THEME_OPTIONS, GnroThemeOptions } from './theme.options';

@Injectable()
export class GnroThemeService {
  private rendererFactory = inject(RendererFactory2);
  private document: Document = inject(GNRO_DOCUMENT);
  private options: GnroThemeOptions = inject(GNRO_THEME_OPTIONS);
  private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
  currentTheme!: string;
  rangeMax = 20; // background color lightness

  constructor() {
    if (this.options?.name) {
      this.changeTheme(this.options.name);
    }
  }

  changeTheme(current: string): void {
    const previous = this.currentTheme;
    this.currentTheme = current;
    localStorage.removeItem('currentTheme');
    localStorage.setItem('currentTheme', current);
    this.updateTheme(current, previous);
    this.setBackgroundColor(this.rangeMax);
  }

  private updateTheme(current: string, previous: string): void {
    const body = this.document.getElementsByTagName('body')[0];
    if (previous) {
      this.renderer.removeClass(body, `gnro-theme-${previous}`);
    }
    this.renderer.addClass(body, `gnro-theme-${current}`);
  }

  setBackgroundColor(value: number): void {
    const root: HTMLBodyElement = document.querySelector(':root')!;
    const range = this.rangeMax - Number(value);
    const lightness = this.currentTheme === 'light' ? 100 - range : range;
    const backgroundColor = `hsl(0 0% ${lightness}%)`;
    root.style.setProperty('--app-background-color', backgroundColor);
  }
}
