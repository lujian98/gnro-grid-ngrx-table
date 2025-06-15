import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localeDate',
})
export class GnroLocaleDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  transform(value: Date, format?: string) {
    if (!value) {
      return '';
    }
    const locale = this.translateService.currentLang || 'en-US';
    return new DatePipe(locale).transform(value, format);
  }
}
