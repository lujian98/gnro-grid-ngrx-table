import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTextFieldComponent, GnroTextFieldConfig } from '@gnro/ui/fields';
import { GnroFieldFilterComponent } from '../field-filter.component';

@Component({
  selector: 'gnro-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['text-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent],
})
export class GnroTextFilterComponent extends GnroFieldFilterComponent {
  override fieldConfig!: Partial<GnroTextFieldConfig>;

  override checkField(): void {
    this.fieldConfig = {
      fieldName: this.column.name,
      clearValue: true,
      placeholder: `GNRO.UI.GRID.FILTER`,
      editable: true,
    };
  }

  override set value(val: string) {
    this._value = val;
  }

  override get value(): string {
    return this._value as string;
  }

  onValueChange(value: string): void {
    this.filterChanged$.next(value);
  }
}
