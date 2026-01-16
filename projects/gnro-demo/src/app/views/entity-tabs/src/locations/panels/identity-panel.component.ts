import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';

@Component({
  selector: 'app-identity-panel',
  template: ` <gnro-text-field [fieldConfig]="fieldConfig" [form]="form"> </gnro-text-field> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent, FormsModule, ReactiveFormsModule],
})
export class AppIdentityPanelComponent implements OnInit {
  form = input.required<FormGroup>();

  fieldConfig: GnroTextFieldConfig = {
    ...defaultTextFieldConfig,
    fieldName: 'fullCodePath',
    fieldLabel: 'Full Code Path',
    labelWidth: 60,
    clearValue: true,
    editable: true,
  };

  ngOnInit(): void {
    this.form().addControl(this.fieldConfig.fieldName!, new FormControl<string>({ value: '', disabled: false }, []));
  }
}
