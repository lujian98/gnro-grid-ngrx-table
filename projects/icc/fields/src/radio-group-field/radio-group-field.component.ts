import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  IccFieldWidthDirective,
  IccFormFieldComponent,
  IccFormFieldControlDirective,
  IccFormFieldErrorsDirective,
  IccLabelDirective,
  IccLabelWidthDirective,
} from '@icc/ui/form-field';
import { IccRadioComponent } from '@icc/ui/radio';
import { TranslatePipe } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { IccFieldsErrorsComponent } from '../field-errors/field-errors.component';
import {
  defaultRadioGroupFieldConfig,
  IccRadioGroup,
  IccRadioGroupFieldConfig,
} from './models/radio-group-field.model';

@Component({
  selector: 'icc-radio-group-field',
  templateUrl: './radio-group-field.component.html',
  styleUrls: ['./radio-group-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IccRadioGroupFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IccRadioGroupFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    IccFormFieldComponent,
    IccLabelDirective,
    IccLabelWidthDirective,
    IccFieldWidthDirective,
    IccRadioComponent,
    IccFormFieldErrorsDirective,
    IccFieldsErrorsComponent,
    IccFormFieldControlDirective,
  ],
})
export class IccRadioGroupFieldComponent implements ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  fieldConfig = input.required({
    transform: (config: Partial<IccRadioGroupFieldConfig>) => {
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

  private initForm(fieldConfig: IccRadioGroupFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<boolean>(false));
    }
    timer(5)
      .pipe(take(1))
      .subscribe(() => this.setDisabledState(!this.fieldConfig().editable));
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

  get groups(): IccRadioGroup[] {
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
    disabled ? this.form().disable() : this.form().enable();
  }

  writeValue(value: { [key: string]: boolean }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
