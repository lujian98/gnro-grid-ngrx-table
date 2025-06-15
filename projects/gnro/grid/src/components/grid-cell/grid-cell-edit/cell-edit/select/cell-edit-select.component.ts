import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroSelectFieldComponent, GnroSelectFieldConfig, defaultSelectFieldConfig } from '@gnro/ui/fields';
import { GnroCellEditBaseComponent } from '../cell-edit-base.component';

@Component({
  selector: 'gnro-cell-edit-select',
  templateUrl: './cell-edit-select.component.html',
  styleUrls: ['cell-edit-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroSelectFieldComponent],
})
export class GnroCellEditSelectComponent<T> extends GnroCellEditBaseComponent<T> {
  override fieldConfig!: Partial<GnroSelectFieldConfig>;

  override checkField(): void {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    this.fieldConfig = {
      ...defaultSelectFieldConfig,
      ...config,
      fieldName: this.column.name,
      clearValue: false,
      editable: true,
    };
  }
}
