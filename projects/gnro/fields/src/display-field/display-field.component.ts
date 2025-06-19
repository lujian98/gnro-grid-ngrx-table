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
import {
  GnroFieldWidthDirective,
  GnroFormFieldComponent,
  GnroFormFieldControlDirective,
  GnroInputDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
} from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { defaultDisplayFieldConfig, GnroDisplayFieldConfig } from './models/display-field.model';

@Component({
  selector: 'gnro-display-field',
  templateUrl: './display-field.component.html',
  styleUrls: ['./display-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroDisplayFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroDisplayFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GnroFormFieldComponent,
    GnroLabelDirective,
    GnroLabelWidthDirective,
    GnroFieldWidthDirective,
    GnroInputDirective,
    GnroIconModule,
    GnroFormFieldControlDirective,
  ],
})
export class GnroDisplayFieldComponent implements ControlValueAccessor, Validator {
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  fieldConfig = input.required({
    transform: (config: Partial<GnroDisplayFieldConfig>) => {
      const fieldConfig = { ...defaultDisplayFieldConfig, ...config };
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

  private initForm(fieldConfig: GnroDisplayFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<string>(''));
    }
  }

  get field(): FormControl {
    return this.form().get(this.fieldConfig().fieldName!)! as FormControl;
  }

  get hidden(): boolean {
    return !!this.fieldConfig().hidden || (this.field.disabled && !!this.fieldConfig().readonlyHidden);
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
