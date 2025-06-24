import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
  ViewChild,
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
import { provideNativeDateAdapter } from '@angular/material/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import {
  GnroFieldWidthDirective,
  GnroFormFieldComponent,
  GnroFormFieldControlDirective,
  GnroFormFieldErrorsDirective,
  GnroInputDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
  GnroSuffixDirective,
} from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroDialogService } from '@gnro/ui/overlay';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, take, timer } from 'rxjs';
import { GnroFieldsErrorsComponent } from '../field-errors/field-errors.component';
import { GnroDatePickerComponent } from './date-picker/date-picker.component';
import { defaultDateFieldConfig, GnroDateFieldConfig } from './models/date-field.model';
import { GnroDateStoreService } from './services/date-store.service';

@Component({
  selector: 'gnro-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GnroIconModule,
    GnroFormFieldComponent,
    GnroButtonComponent,
    GnroSuffixDirective,
    GnroLabelDirective,
    GnroLabelWidthDirective,
    GnroFieldWidthDirective,
    GnroInputDirective,
    GnroFormFieldErrorsDirective,
    GnroFieldsErrorsComponent,
    GnroFormFieldControlDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroDateFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroDateFieldComponent),
      multi: true,
    },
    GnroDateStoreService,
    provideNativeDateAdapter(),
  ],
})
export class GnroDateFieldComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(GnroDialogService);
  private readonly injector = inject(Injector);
  private readonly dateStoreService = inject(GnroDateStoreService);
  private readonly destroyRef = inject(DestroyRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroDateFieldConfig>) => {
      const fieldConfig = { ...defaultDateFieldConfig, ...config };
      this.initForm(fieldConfig);
      return fieldConfig;
    },
  });
  value = input(null, {
    transform: (value: Date | null) => {
      this.field.setValue(value);
      this.dateStoreService.updateSelected(value);
      return value;
    },
  });
  valueChange = output<Date | null>();

  private initForm(fieldConfig: GnroDateFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<Date | string>(''));
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
    return !!this.field.value && !this.field.disabled;
  }

  get display(): string {
    const date = this.field.value;
    if (date) {
      const locale = this.translateService.currentLang || 'en-US';
      return new DatePipe(locale).transform(date, this.fieldConfig().dateFormat)!;
    } else {
      return '';
    }
  }

  @ViewChild('calendarInput', { static: false }) calendarInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.translateService.onLangChange
      .pipe(delay(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.setLocaleChange());

    this.dateStoreService.updateSelected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectedDate) => {
      this.field.setValue(selectedDate);
      this.valueChange.emit(selectedDate);
      this.changeDetectorRef.markForCheck();
    });
  }

  private setLocaleChange(): void {
    const fieldValue = this.field.value;
    this.field.setValue('');
    timer(5)
      .pipe(take(1))
      .subscribe(() => {
        this.field.setValue(fieldValue);
      });
  }

  openCalendar(): void {
    this.dialogService.open(GnroDatePickerComponent, {
      context: {
        fieldConfig: this.fieldConfig(),
        field: this.field,
      },
      hostElemRef: this.calendarInput,
      injector: this.injector,
    });
  }

  public resetSelectedDate(selectedDate: Date | null) {
    this.dateStoreService.updateSelected(selectedDate);
  }

  clearSelectedDate(event: MouseEvent) {
    this.resetSelectedDate(null);
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

  writeValue(value: { [key: string]: Date }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
