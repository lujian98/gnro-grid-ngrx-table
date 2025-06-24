import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defaultDateFieldConfig, GnroDateFieldConfig } from '@gnro/ui/fields';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-date',
  templateUrl: './grid-cell-date.component.html',
  styleUrls: ['./grid-cell-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellDateComponent extends GnroGridCellRendererComponent<Date> implements OnInit {
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  get fieldConfig(): GnroDateFieldConfig {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    return {
      ...defaultDateFieldConfig,
      ...config,
    };
  }

  get display(): string {
    if (this.data) {
      const locale = this.translateService.currentLang || 'en-US';
      return new DatePipe(locale).transform(this.data, this.fieldConfig.dateFormat)!;
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    this.translateService.onLangChange
      .pipe(delay(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changeDetectorRef.markForCheck());
  }
}
