import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  defaultSelectFieldConfig,
  GnroOptionType,
  GnroSelectFieldComponent,
  GnroSelectFieldConfig,
} from '@gnro/ui/fields';
import { GnroFieldFilterComponent } from '../field-filter.component';

@Component({
  selector: 'gnro-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroSelectFieldComponent],
})
export class GnroSelectFilterComponent extends GnroFieldFilterComponent {
  override fieldConfig!: Partial<GnroSelectFieldConfig>;
  options: GnroOptionType[] = [];

  override checkField(): void {
    const fieldConfig = {
      ...defaultSelectFieldConfig,
      fieldName: this.column.name,
      clearValue: true,
      urlKey: this.gridConfig.urlKey,
      remoteOptions: true,
      editable: true,
      placeholder: `GNRO.UI.GRID.FILTER`,
    };
    this.fieldConfig = this.fieldConfig ? { ...fieldConfig, ...this.fieldConfig } : { ...fieldConfig };

    if (this.fieldConfig.options) {
      this.options = this.fieldConfig.options;
      delete this.fieldConfig.options;
    }
    this.column.filterFieldConfig = { ...this.fieldConfig };
  }

  override set value(val: string | string[] | object[]) {
    if (!val) {
      val = this.fieldConfig.multiSelection ? [] : '';
    }
    this._value = val;
  }

  override get value(): string | string[] | object[] {
    return this._value as string | string[] | object[];
  }

  onValueChange(value: string | object | string[] | object[]): void {
    if (Array.isArray(value)) {
      this.applyFilter(value);
    } else {
      this.applyFilter((value ? [value] : []) as string[] | object[]);
    }
  }
}
