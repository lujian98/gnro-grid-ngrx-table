import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GnroTextFieldComponent, GnroTextFieldConfig } from '@gnro/ui/fields';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs';
import { GnroFieldFilterComponent } from '../field-filter.component';

@Component({
  selector: 'gnro-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['number-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent],
})
export class GnroNumberFilterComponent extends GnroFieldFilterComponent implements OnInit {
  override fieldConfig!: Partial<GnroTextFieldConfig>;
  private readonly translateService = inject(TranslateService);

  override checkField(): void {
    const filterI18n = this.translateService.instant('GNRO.UI.GRID.FILTER');
    this.fieldConfig = {
      fieldName: this.column.name,
      clearValue: true,
      placeholder: `${filterI18n} > < <= >= = null !null`,
      editable: true,
    };
  }

  override set value(val: string) {
    this._value = val;
  }

  override get value(): string {
    return this._value as string;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.pipe(delay(50), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.checkField();
      this.changeDetectorRef.markForCheck();
    });
  }

  onValueChange(value: string): void {
    this.filterChanged$.next(value);
  }
}
