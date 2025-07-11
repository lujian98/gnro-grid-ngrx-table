import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
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
  GnroFormFieldErrorsDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
} from '@gnro/ui/form-field';
import { GnroRadioComponent, GnroRadioGroupDirective } from '@gnro/ui/radio-group';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroFieldsErrorsComponent } from '../field-errors/field-errors.component';
import {
  defaultRadioGroupFieldConfig,
  GnroRadioGroup,
  GnroRadioGroupFieldConfig,
} from './models/radio-group-field.model';

@Component({
  selector: 'gnro-radio-group-field',
  templateUrl: './radio-group-field.component.html',
  styleUrls: ['./radio-group-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroRadioGroupFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroRadioGroupFieldComponent),
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
    GnroRadioGroupDirective,
    GnroRadioComponent,
    GnroFormFieldErrorsDirective,
    GnroFieldsErrorsComponent,
    GnroFormFieldControlDirective,
  ],
})
export class GnroRadioGroupFieldComponent implements ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroRadioGroupFieldConfig>) => {
      const fieldConfig = { ...defaultRadioGroupFieldConfig, ...config };
      this.initForm(fieldConfig);
      return fieldConfig;
    },
  });
  value = input(false, {
    transform: (value: boolean) => {
      this.field.setValue(value);
      return value;
    },
  });
  valueChange = output<boolean>();

  private initForm(fieldConfig: GnroRadioGroupFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<boolean>(false));
    }
  }

  get field(): FormControl {
    return this.form().get(this.fieldConfig().fieldName!)! as FormControl;
  }

  get hidden(): boolean {
    // not able to hide for the radio group if field is dirty
    return (
      !!this.fieldConfig().hidden || (this.field.disabled && !!this.fieldConfig().readonlyHidden && !this.field.dirty)
    );
  }

  get groups(): GnroRadioGroup[] {
    return this.fieldConfig().groups;
  }

  getChecked(name: string): boolean {
    return name === this.field.value;
  }

  onChange(): void {
    this.valueChange.emit(this.field.value);
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

  writeValue(value: { [key: string]: boolean }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
