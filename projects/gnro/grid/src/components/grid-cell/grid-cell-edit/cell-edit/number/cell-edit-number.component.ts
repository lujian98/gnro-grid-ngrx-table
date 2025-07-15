import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroNumberFieldComponent, GnroNumberFieldConfig, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroCellEditBaseComponent } from '../cell-edit-base.component';

@Component({
  selector: 'gnro-cell-edit-number',
  templateUrl: './cell-edit-number.component.html',
  styleUrls: ['cell-edit-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroNumberFieldComponent],
})
export class GnroCellEditNumberComponent extends GnroCellEditBaseComponent<number> {
  override fieldConfig!: Partial<GnroNumberFieldConfig>;

  override checkField(): void {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    this.fieldConfig = {
      ...defaultNumberFieldConfig,
      ...config,
      ...this.baseFieldConfig,
      fieldName: this.column.name,
      clearValue: false,
      editable: true,
    };
  }
}
