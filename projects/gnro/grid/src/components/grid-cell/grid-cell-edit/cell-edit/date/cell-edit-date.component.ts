import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroDateFieldComponent, GnroDateFieldConfig, defaultDateFieldConfig } from '@gnro/ui/fields';
import { GnroCellEditBaseComponent } from '../cell-edit-base.component';

@Component({
  selector: 'gnro-cell-edit-date',
  templateUrl: './cell-edit-date.component.html',
  styleUrls: ['cell-edit-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroDateFieldComponent],
})
export class GnroCellEditDateComponent extends GnroCellEditBaseComponent<Date> {
  override fieldConfig!: Partial<GnroDateFieldConfig>;

  override checkField(): void {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    this.fieldConfig = {
      ...defaultDateFieldConfig,
      ...config,
      ...this.baseFieldConfig,
      fieldName: this.column.name,
      clearValue: false,
      editable: true,
    };
  }
}
