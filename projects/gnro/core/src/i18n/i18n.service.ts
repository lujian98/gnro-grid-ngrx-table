import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, take } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { GnroLanguage, languages } from './i18n.model';

@Injectable()
export class GnroI18nService {
  private translateService = inject(TranslateService);
  private _currentLang!: GnroLanguage;
  languages = languages;

  set currentLang(lang: string | GnroLanguage) {
    if (typeof lang === 'string') {
      if (this._currentLang?.isocode !== lang) {
        const find = this.languages.find((item) => item.isocode === lang);
        if (find) {
          this._currentLang = find;
          this.initLang();
        }
      }
    } else if (this._currentLang?.isocode !== lang.isocode) {
      this._currentLang = lang;
      this.initLang();
    }
  }

  get currentLang(): GnroLanguage {
    return this._currentLang;
  }

  constructor() {
    this.currentLang = languages[0]; // 'en-US'
  }

  setLang(selected: GnroLanguage): void {
    if (this.currentLang.isocode !== selected.isocode) {
      this.currentLang = selected;
    }
  }

  private initLang(): void {
    this.localeInitializer(this.currentLang.isocode);
  }

  private loadLocale = (locale: string) => {
    switch (locale) {
      case 'zh':
        return import(`@angular/common/locales/zh`);
      case 'ja':
        return import(`@angular/common/locales/ja`);
      default:
        return import(`@angular/common/locales/en`);
    }
  };

  private loadLocaleExtra = (locale: string) => {
    switch (locale) {
      case 'zh':
        return import('@angular/common/locales/extra/zh');
      case 'ja':
        return import('@angular/common/locales/extra/ja');
      default:
        return import('@angular/common/locales/extra/en');
    }
  };

  private localeInitializer(key: string): void {
    const localeId = key.indexOf('-') > -1 ? key.substring(0, key.indexOf('-')) : key;
    const base = this.loadLocale(localeId);
    const extra = this.loadLocaleExtra(localeId);

    combineLatest([base, extra])
      .pipe(take(1))
      .subscribe(([baseModule, extraModule]) => {
        registerLocaleData(baseModule.default, key, extraModule.default);
        this.translateService.use(this.currentLang.isocode);
      });
  }
}
