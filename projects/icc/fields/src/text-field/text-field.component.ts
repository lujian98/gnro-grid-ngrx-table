import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  ViewChild,
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
  Validators,
} from '@angular/forms';
import {
  IccFieldWidthDirective,
  IccFormFieldComponent,
  IccFormFieldControlDirective,
  IccFormFieldErrorsDirective,
  IccInputDirective,
  IccLabelDirective,
  IccLabelWidthDirective,
  IccSuffixDirective,
} from '@icc/ui/form-field';
import { IccIconModule } from '@icc/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { IccFieldsErrorsComponent } from '../field-errors/field-errors.component';
import { defaultTextFieldConfig, IccTextFieldConfig } from './models/text-field.model';

@Component({
  selector: 'icc-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IccTextFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IccTextFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    IccFormFieldComponent,
    IccSuffixDirective,
    IccLabelDirective,
    IccLabelWidthDirective,
    IccFieldWidthDirective,
    IccInputDirective,
    IccIconModule,
    IccFormFieldErrorsDirective,
    IccFieldsErrorsComponent,
    IccFormFieldControlDirective,
  ],
})
export class IccTextFieldComponent implements ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  fieldConfig = input.required({
    transform: (config: Partial<IccTextFieldConfig>) => {
      const fieldConfig = { ...defaultTextFieldConfig, ...config };
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
  valueChange = output<string>();

  private initForm(fieldConfig: IccTextFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<string>(''));
    }
    timer(5)
      .pipe(take(1))
      .subscribe(() => this.setDisabledState(!this.fieldConfig().editable));
  }

  get field(): FormControl {
    return this.form().get(this.fieldConfig().fieldName!)! as FormControl;
  }

  get required(): boolean {
    return this.field.hasValidator(Validators.required) && !this.field.disabled;
  }

  get hidden(): boolean {
    return !!this.fieldConfig().hidden || (this.field.disabled && !!this.fieldConfig().readonlyHidden);
  }

  get hasValue(): boolean {
    return (!!this.field.value || this.field.value === 0) && !this.field.disabled;
  }

  @ViewChild('inputEl') inputEl!: ElementRef;

  onChange(): void {
    this.field.markAsTouched();
    this.valueChange.emit(this.field.value);
  }

  clearValue(): void {
    this.field.setValue('');
    this.valueChange.emit('');
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

  writeValue(value: { [key: string]: string }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
