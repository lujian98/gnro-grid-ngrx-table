import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { GnroFormFieldComponent, GnroInputDirective } from '@gnro/ui/form-field';
import { defaultHiddenFieldConfig, GnroHiddenFieldConfig } from './models/hidden-field.model';

@Component({
  selector: 'gnro-hidden-field',
  templateUrl: './hidden-field.component.html',
  styleUrls: ['./hidden-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroHiddenFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroHiddenFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, GnroFormFieldComponent, GnroInputDirective],
})
export class GnroHiddenFieldComponent implements ControlValueAccessor, Validator {
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  fieldConfig = input.required({
    transform: (config: Partial<GnroHiddenFieldConfig>) => {
      const fieldConfig = { ...defaultHiddenFieldConfig, ...config };
      this.initForm(fieldConfig);
      return fieldConfig;
    },
  });
  value = input('', {
    transform: (value: string) => {
      this.field.setValue(value);
      return value;
    },
  });

  private initForm(fieldConfig: GnroHiddenFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<string>(''));
    }
  }

  get field(): FormControl {
    return this.form().get(this.fieldConfig().fieldName!)! as FormControl;
  }

  registerOnChange(fn: Function): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this.field.disable() : this.field.enable();
  }

  writeValue(value: { [key: string]: string }): void {
    this.form().patchValue(value, { emitEvent: false });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
