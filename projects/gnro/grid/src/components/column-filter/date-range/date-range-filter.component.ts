import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GnroDateRange,
  GnroDateRangeFieldComponent,
  GnroDateRangeFieldConfig,
  defaultDateRangeFieldConfig,
} from '@gnro/ui/fields';
import { GnroFieldFilterComponent } from '../field-filter.component';

@Component({
  selector: 'gnro-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroDateRangeFieldComponent],
})
export class GnroDateRangeFilterComponent extends GnroFieldFilterComponent {
  override fieldConfig!: Partial<GnroDateRangeFieldConfig>;

  override checkField(): void {
    const today = new Date();
    this.fieldConfig = {
      ...defaultDateRangeFieldConfig,
      ...this.baseFieldConfig,
      fieldName: this.column.name,
      clearValue: true,
      placeholder: `GNRO.UI.GRID.FILTER`,
      editable: true,
      fromMinMax: { fromDate: null, toDate: new Date(today.getFullYear(), today.getMonth() + 1, 0) },
      toMinMax: { fromDate: new Date(today.getFullYear(), today.getMonth() + 1, 1), toDate: null },
    };
  }

  override set value(val: GnroDateRange) {
    this._value = val;
  }

  override get value(): GnroDateRange {
    return this._value as GnroDateRange;
  }

  onValueChange(value: GnroDateRange | null): void {
    if (this.value?.fromDate !== value?.fromDate || this.value?.toDate !== value?.toDate) {
      this.filterChanged$.next(value);
    }
  }
}
