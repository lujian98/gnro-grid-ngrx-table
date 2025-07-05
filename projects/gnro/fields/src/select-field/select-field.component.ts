import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
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
  GnroAutocompleteComponent,
  GnroAutocompleteContentDirective,
  GnroAutocompleteDirective,
} from '@gnro/ui/autocomplete';
import { uniqueId } from '@gnro/ui/core';
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
import { GnroOptionComponent } from '@gnro/ui/option';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroFieldsErrorsComponent } from '../field-errors/field-errors.component';
import { GnroSelectFieldStateModule } from './+state/select-field-state.module';
import { GnroSelectFieldFacade } from './+state/select-field.facade';
import { GnroSelectOptionComponent } from './components/select-option.component';
import { defaultSelectFieldConfig } from './models/default-select-field';
import { GnroOptionType, GnroSelectFieldConfig } from './models/select-field.model';

@Component({
  selector: 'gnro-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroSelectFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GnroSelectFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GnroSelectFieldStateModule,
    GnroFormFieldComponent,
    GnroSuffixDirective,
    GnroLabelDirective,
    GnroLabelWidthDirective,
    GnroFieldWidthDirective,
    GnroInputDirective,
    GnroAutocompleteComponent,
    GnroAutocompleteDirective,
    GnroAutocompleteContentDirective,
    GnroIconModule,
    GnroFormFieldErrorsDirective,
    GnroFieldsErrorsComponent,
    GnroFormFieldControlDirective,
    GnroSelectOptionComponent,
  ],
})
export class GnroSelectFieldComponent<T, G> implements OnDestroy, ControlValueAccessor, Validator {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  onChanged: Function = () => {};
  onTouched: Function = () => {};
  private selectFieldFacade = inject(GnroSelectFieldFacade);
  private fieldId = `select-${crypto.randomUUID()}`;
  private firstTimeLoad = true;
  setSelected: boolean = false;
  fieldConfig$ = this.selectFieldFacade.getFieldConfig(this.fieldId);
  fieldSetting$ = this.selectFieldFacade.getSetting(this.fieldId);
  selectOptions$ = this.selectFieldFacade.getOptions(this.fieldId);

  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  showFieldEditIndicator = input<boolean>(true);
  editable$ = computed(() => !!this.fieldConfig().editable);
  fieldConfig = input.required({
    transform: (config: Partial<GnroSelectFieldConfig>) => {
      const fieldConfig = { ...defaultSelectFieldConfig, ...config };
      if (this.firstTimeLoad) {
        this.selectFieldFacade.initFieldConfig(this.fieldId, fieldConfig);
        this.firstTimeLoad = false;
      }
      if (fieldConfig.options) {
        this.selectFieldFacade.setSelectFieldOptions(this.fieldId, fieldConfig.options);
      }
      return fieldConfig;
    },
  });
  //WARNING local set option only, only add field config if no initial input fieldconfig
  options = input([], {
    transform: (options: GnroOptionType[]) => {
      this.selectFieldFacade.setSelectFieldOptions(this.fieldId, options);
      return options;
    },
  });
  value$ = signal<string | object | string[] | object[]>([]);
  value = input('', {
    transform: (value: string | object | string[] | object[]) => {
      if (this.field && value !== undefined) {
        this.field.setValue(value);
      }
      this.value$.set(value);
      return value;
    },
  });
  requireReload = input(false, {
    transform: (requireReload: boolean) => {
      if (requireReload && this.fieldConfig().remoteOptions) {
        this.selectFieldFacade.reloadSelectFieldOptions(this.fieldId);
      }
      return requireReload;
    },
  });
  valueChange = output<T | T[]>();

  getForm(): FormGroup {
    if (this.fieldSetting$()?.viewportReady && !this.field) {
      this.form().addControl(this.fieldConfig$().fieldName, new FormControl<{ [key: string]: T }>({}));
      this.setFormvalue();
    }
    return this.form();
  }

  private setFormvalue(): void {
    this.field?.setValue(this.value());
  }

  get field(): FormControl {
    return this.form()?.get(this.fieldConfig$().fieldName)! as FormControl;
  }

  get fieldValue(): T[] {
    return this.field.value instanceof Array ? this.field.value : [this.field.value];
  }

  get required(): boolean {
    return this.field.hasValidator(Validators.required) && !this.field.disabled;
  }

  get hidden(): boolean {
    return !!this.fieldConfig$().hidden || (this.field?.disabled && !!this.fieldConfig$().readonlyHidden);
  }

  get hasValue(): boolean {
    const value = this.field.value;
    return (value instanceof Array ? value.length > 0 : !!value) && !this.field.disabled;
  }

  @ViewChild(GnroAutocompleteComponent, { static: false })
  autocompleteComponent!: GnroAutocompleteComponent<{ [key: string]: T } | { [key: string]: T }[], G>;
  isOverlayOpen!: boolean;
  autocompleteClose!: boolean;
  clickedOption: string | undefined;
  onClickedOption(option: GnroOptionComponent<unknown>) {
    this.autocompleteComponent.setSelectionOption(
      option as GnroOptionComponent<{ [key: string]: T } | { [key: string]: T }[]>,
    );
    this.clickedOption = uniqueId(16);
  }
  onAutocompleteClose(close: boolean): void {
    this.autocompleteClose = close;
  }
  onSelectOptionValueChange(value: T | T[]): void {
    this.field.setValue(value);
    this.valueChange.emit(value);
    this.value$.set(value as string | object | string[] | object[]);
  }

  displayFn(value: string | { [key: string]: string } | { [key: string]: string }[]): string {
    this.changeDetectorRef.markForCheck();
    if (this.fieldConfig$().displayWith) {
      return this.fieldConfig$().displayWith!(this.field.value);
    }
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return (
          value
            .map((item) => {
              return this.fieldSetting$()!.singleListOption ? item : item[this.fieldConfig$().optionLabel];
            })
            .sort()
            //.sort((a, b) => (a && b) ? a.localeCompare(b) : 0)
            .join(', ')
        );
      } else {
        return '';
      }
    } else {
      if (this.fieldSetting$()!.singleListOption) {
        return value as string;
      } else {
        return value ? (value as { [key: string]: string })[this.fieldConfig$().optionLabel] : '';
      }
    }
  }

  compareFn(s1: { [key: string]: string }, s2: { [key: string]: string }): boolean {
    if (this.fieldSetting$()!.singleListOption) {
      return s1 && s2 && s1 === s2;
    } else {
      return s1 && s2 ? s1[this.fieldConfig$().optionKey] === s2[this.fieldConfig$().optionKey] : s1 === s2;
    }
  }

  overlayOpen(event: boolean): void {
    this.isOverlayOpen = event;
    if (this.isOverlayOpen) {
      this.autocompleteClose = false;
      this.setSelected = true;
    } else {
      if (this.fieldConfig$().multiSelection) {
        this.setValueChanged(this.value$());
      } else if (this.fieldConfig$().selectOnly) {
        this.setValueChanged(this.field.value);
      } else {
        const fieldValue = this.field.value;
        if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
          if (this.selectOptions$().every((i) => typeof i === 'string' || typeof i === 'number')) {
            const find = this.selectOptions$().find((option) => option === fieldValue);
            if (find) {
              this.setValueChanged(find);
            } else {
              this.setValueChanged(this.value$());
            }
          } else {
            this.setValueChanged(this.value$());
          }
        } else {
          this.setValueChanged(this.field.value);
        }
      }
    }
  }

  private setValueChanged(value: string | object | string[] | object[]): void {
    this.field.setValue(value);
    this.valueChange.emit(value as T | T[]);
    this.value$.set(value);
  }

  onChange(): void {
    if (this.fieldConfig$().multiSelection) {
      this.valueChange.emit(this.fieldValue);
      this.setSelected = false;
    }
  }

  closeOverlay(): void {
    this.autocompleteClose = true;
  }

  clearSelected(event: MouseEvent): void {
    event.stopPropagation();
    if (this.fieldConfig$().multiSelection) {
      this.field.setValue([]);
      this.valueChange.emit([]);
    } else {
      this.field.setValue('');
      this.valueChange.emit('' as T);
    }
    this.changeDetectorRef.markForCheck();
    this.setSelected = false;
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

  writeValue(value: { [key: string]: string[] | object[] }): void {
    this.form().patchValue(value, { emitEvent: false });
    this.changeDetectorRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form().valid ? null : { [this.fieldConfig$().fieldName]: true };
  }

  ngOnDestroy(): void {
    this.selectFieldFacade.clearSelectFieldStore(this.fieldId);
  }
}
