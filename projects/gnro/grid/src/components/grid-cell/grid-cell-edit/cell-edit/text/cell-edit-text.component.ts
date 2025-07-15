import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';
import { GnroCellEditBaseComponent } from '../cell-edit-base.component';

@Component({
  selector: 'gnro-cell-edit-text',
  templateUrl: './cell-edit-text.component.html',
  styleUrls: ['cell-edit-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent],
})
export class GnroCellEditTextComponent extends GnroCellEditBaseComponent<string> {
  override fieldConfig!: Partial<GnroTextFieldConfig>;

  override checkField(): void {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    this.fieldConfig = {
      ...defaultTextFieldConfig,
      ...config,
      ...this.baseFieldConfig,
      fieldName: this.column.name,
      clearValue: false,
      editable: true,
    };
  }
}
