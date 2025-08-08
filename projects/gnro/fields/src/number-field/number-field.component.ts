import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
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
  GnroFieldWidthDirective,
  GnroFormFieldComponent,
  GnroFormFieldControlDirective,
  GnroInputDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
  GnroSuffixDirective,
  GnroNumericDirective,
} from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { defaultNumberFieldConfig, GnroNumberFieldConfig } from './models/number-field.model';

@Component({
  selector: 'gnro-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroNumberFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroNumberFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    GnroFormFieldComponent,
    GnroSuffixDirective,
    GnroLabelDirective,
    GnroLabelWidthDirective,
    GnroFieldWidthDirective,
    GnroInputDirective,
    GnroIconModule,
    TranslatePipe,
    GnroFormFieldControlDirective,
    GnroNumericDirective,
  ],
})
export class GnroNumberFieldComponent implements ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroNumberFieldConfig>) => {
      const fieldConfig = { ...defaultNumberFieldConfig, ...config };
      this.initForm(fieldConfig);
      return fieldConfig;
    },
  });
  value = input(null, {
    transform: (value: number | null) => {
      this.field.setValue(value);
      return value;
    },
  });
  valueChange = output<number | null>();

  private initForm(fieldConfig: GnroNumberFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<number | null>(null));
    }
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
    this.field.setValue(null);
    this.valueChange.emit(null);
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

  patchValue(value: number): void {
    this.field.patchValue(value, { emitEvent: false, onlySelf: true });
  }

  writeValue(value: { [key: string]: number }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
