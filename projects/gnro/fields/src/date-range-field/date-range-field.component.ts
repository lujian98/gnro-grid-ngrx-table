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
  GnroInputDirective,
  GnroLabelDirective,
  GnroLabelWidthDirective,
  GnroSuffixDirective,
} from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroDialogService } from '@gnro/ui/overlay';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GnroDateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { defaultDateRangeFieldConfig, GnroDateRange, GnroDateRangeFieldConfig } from './models/date-range-field.model';
import { GnroDateRangeStoreService } from './services/date-range-store.service';

@Component({
  selector: 'gnro-date-range-field',
  templateUrl: './date-range-field.component.html',
  styleUrls: ['./date-range-field.component.scss'],
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
    GnroFormFieldControlDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroDateRangeFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroDateRangeFieldComponent),
      multi: true,
    },
    GnroDateRangeStoreService,
    provideNativeDateAdapter(),
  ],
})
export class GnroDateRangeFieldComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(GnroDialogService);
  private readonly injector = inject(Injector);
  private readonly rangeStoreService = inject(GnroDateRangeStoreService);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroDateRangeFieldConfig>) => {
      const fieldConfig = { ...defaultDateRangeFieldConfig, ...config };
      this.initForm(fieldConfig);
      return fieldConfig;
    },
  });
  value = input(null, {
    transform: (value: GnroDateRange | null) => {
      this.field.setValue(value);
      this.rangeStoreService.updateRange(value?.fromDate!, value?.toDate!);
      return value;
    },
  });
  valueChange = output<GnroDateRange | null>();

  private initForm(fieldConfig: GnroDateRangeFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<GnroDateRange | null>(null));
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
    const range = this.field.value;
    if (range && range.fromDate && range.toDate) {
      const locale = this.translateService.currentLang || 'en-US';
      const from = new DatePipe(locale).transform(range.fromDate, this.fieldConfig().dateFormat);
      const to = new DatePipe(locale).transform(range.toDate, this.fieldConfig().dateFormat);
      return `${from} - ${to}`;
    } else {
      return '';
    }
  }

  @ViewChild('calendarInput', { static: false }) calendarInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.rangeStoreService.rangeUpdate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((range) => {
      this.field.setValue(range);
      this.valueChange.emit(range);
      this.changeDetectorRef.detectChanges();
    });
  }

  openCalendar(): void {
    this.dialogService.open(GnroDateRangePickerComponent, {
      context: {
        fieldConfig: this.fieldConfig(),
      },
      hostElemRef: this.calendarInput,
      injector: this.injector,
    });
  }

  public resetDates(range: GnroDateRange): void {
    this.rangeStoreService.updateRange(range.fromDate!, range.toDate!);
  }

  clearDateRange(event: MouseEvent): void {
    this.rangeStoreService.updateRange(null, null);
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

  writeValue(value: { [key: string]: GnroDateRange }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
