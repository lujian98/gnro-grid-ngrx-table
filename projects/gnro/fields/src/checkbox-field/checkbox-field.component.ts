import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { GnroCheckboxComponent } from '@gnro/ui/checkbox';
import {
  GnroFieldWidthDirective,
  GnroFormFieldComponent,
  GnroFormFieldControlDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
} from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { defaultCheckboxFieldConfig, GnroCheckboxFieldConfig } from './models/checkbox-field.model';

@Component({
  selector: 'gnro-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroCheckboxFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroCheckboxFieldComponent),
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
    GnroIconModule,
    GnroCheckboxComponent,
    GnroFormFieldControlDirective,
  ],
})
export class GnroCheckboxFieldComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  disabled = input<boolean>(false);
  fieldConfig = input.required({
    transform: (config: Partial<GnroCheckboxFieldConfig>) => {
      const fieldConfig = { ...defaultCheckboxFieldConfig, ...config };
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

  private initForm(fieldConfig: GnroCheckboxFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<boolean>(false));
      this.setEnableFields();
    }
    timer(5)
      .pipe(take(1))
      .subscribe(() => {
        this.setEnableFields();
      });
  }

  ngOnInit(): void {
    if (this.field) {
      this.field.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setEnableFields());
    }
  }

  get field(): FormControl {
    return this.form().get(this.fieldConfig().fieldName!)! as FormControl;
  }

  get hidden(): boolean {
    return !!this.fieldConfig().hidden || (this.field.disabled && !!this.fieldConfig().readonlyHidden);
  }

  onChange(): void {
    this.field.markAsTouched();
    this.valueChange.emit(this.field.value);
    this.setEnableFields();
  }

  gnroSuffixClick(event: MouseEvent): void {
    event.stopPropagation();
    const val = this.field.value;
    this.field.patchValue(!val);
    this.changeDetectorRef.markForCheck();
  }

  private setEnableFields(): void {
    timer(20)
      .pipe(take(1))
      .subscribe(() => {
        this.setRequiredFields(this.field.value);
        this.setReadonlyFields(this.field.value);
      });
  }

  private setRequiredFields(checked: boolean): void {
    if (this.fieldConfig().requiredFields) {
      this.fieldConfig().requiredFields!.forEach((name) => {
        const formField = this.form().get(name)!;
        if (formField) {
          if (checked) {
            formField.addValidators(Validators.required);
            formField.updateValueAndValidity();
          } else {
            formField.setErrors(null);
            formField.removeValidators(Validators.required);
          }
        }
      });
    }
  }

  private setReadonlyFields(checked: boolean): void {
    if (this.fieldConfig().readonlyFields) {
      this.fieldConfig().readonlyFields!.forEach((name) => {
        const formField = this.form().get(name)!;
        if (formField) {
          if (checked && this.fieldConfig().editable) {
            formField.enable();
          } else {
            formField.setErrors(null);
            formField.disable();
          }
        }
      });
    }
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
