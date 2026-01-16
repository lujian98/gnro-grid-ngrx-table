import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';

@Component({
  selector: 'app-identity-panel',
  template: ` <gnro-text-field [fieldConfig]="fieldConfig" [form]="form"> </gnro-text-field> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent, FormsModule, ReactiveFormsModule],
})
export class AppIdentityPanelComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() values: Record<string, unknown> = {};

  fieldConfig: GnroTextFieldConfig = {
    ...defaultTextFieldConfig,
    fieldName: 'fullCodePath',
    fieldLabel: 'Full Code Path',
    labelWidth: 60,
    clearValue: true,
    editable: true,
  };

  ngOnInit(): void {
    const fieldName = this.fieldConfig.fieldName!;
    // Get initial value from passed values or empty string
    const initialValue = this.values[fieldName] ?? '';
    this.form.addControl(fieldName, new FormControl<string>({ value: initialValue as string, disabled: false }, []));
  }
}
