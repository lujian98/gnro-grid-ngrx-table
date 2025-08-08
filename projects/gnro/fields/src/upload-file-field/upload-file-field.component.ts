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
import { GnroUploadFileService } from '@gnro/ui/core';
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
import { TranslatePipe } from '@ngx-translate/core';
import { defaultUploadFileFieldConfig, GnroUploadFileFieldConfig } from './models/upload-file-field.model';

@Component({
  selector: 'gnro-upload-file-field',
  templateUrl: './upload-file-field.component.html',
  styleUrls: ['./upload-file-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroUploadFileFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroUploadFileFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GnroFormFieldComponent,
    GnroSuffixDirective,
    GnroLabelDirective,
    GnroLabelWidthDirective,
    GnroFieldWidthDirective,
    GnroInputDirective,
    GnroIconModule,
    GnroFormFieldControlDirective,
  ],
})
export class GnroUploadFileFieldComponent implements ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly uploadFileService = inject(GnroUploadFileService);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroUploadFileFieldConfig>) => {
      const fieldConfig = { ...defaultUploadFileFieldConfig, ...config };
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
  selectUploadFile = output<File | null>();

  private initForm(fieldConfig: GnroUploadFileFieldConfig): void {
    if (!this.form().get(fieldConfig.fieldName!)) {
      this.form().addControl(fieldConfig.fieldName!, new FormControl<string>(''));
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

  @ViewChild('fileInput') fileInput?: ElementRef;

  get selectedFile(): File | null {
    if (this.fileInput?.nativeElement.files.length > 0) {
      return this.fileInput?.nativeElement.files[0];
    } else {
      return null;
    }
  }

  onChange(event: Event): void {
    this.field.markAsTouched();
    this.valueChange.emit(this.field.value);
    // TODO still need use uploadFileService.formUploadFileChanged ?? for from field save with upload file???
    this.uploadFileService.formUploadFileChanged(this.fieldConfig().fieldName!, this.selectedFile);
    this.selectUploadFile.emit(this.selectedFile);
  }

  clearValue(): void {
    this.field.setValue('');
    this.field.markAsPristine();
    this.valueChange.emit('');
    this.selectUploadFile.emit(this.selectedFile);
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
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig().fieldName!]: true };
  }
}
