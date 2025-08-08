import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GnroButtonComponent } from '@gnro/ui/button';
import {
  GnroButtonConfg,
  GnroButtonType,
  GnroObjectType,
  GnroBUTTONS,
  GnroUploadFileService,
  isEqual,
} from '@gnro/ui/core';
import {
  GnroFieldsComponent,
  GnroFieldsetComponent,
  GnroFieldsetConfig,
  GnroFormField,
  GnroNumberFieldConfig,
  GnroTextFieldConfig,
} from '@gnro/ui/fields';
import { GnroFormLabelWidthDirective } from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroFormFacade } from '../+state/form.facade';
import { GnroFormButtonClick, GnroFormConfig, GnroFormSetting } from '../models/form.model';

@Component({
  selector: 'gnro-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    GnroFieldsetComponent,
    GnroFormLabelWidthDirective,
    GnroFieldsComponent,
    GnroLayoutHeaderComponent,
    GnroButtonComponent,
    GnroIconModule,
  ],
})
export class GnroFormViewComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly uploadFileService = inject(GnroUploadFileService);
  private readonly formFacade = inject(GnroFormFacade);
  private readonly destroyRef = inject(DestroyRef);
  form: FormGroup = new FormGroup({});
  FieldType = GnroObjectType;
  formSetting = input.required<GnroFormSetting>();
  formConfig = input.required<GnroFormConfig>();
  formFields = input([], {
    transform: (formFields: GnroFormField[]) => {
      this.addFormControls(formFields);
      if (this.formConfig().validators) {
        this.form.addValidators(this.formConfig().validators!);
      }
      if (this.values()) {
        this.form.patchValue(this.values()!);
      }
      return formFields;
    },
  });
  values = input(undefined, {
    transform: (values: object) => {
      if (this.form) {
        if (values) {
          this.form.patchValue({ ...values });
        }
        this.form.markAsPristine();
        //this.form.reset();
      }
      if (this.formConfig().editing) {
        this.formFacade.setFormEditable(this.formSetting().formId, GnroBUTTONS.Edit);
      }
      return values;
    },
  });
  formButtonClick = output<GnroFormButtonClick>();

  private addFormControls(formFields: GnroFormField[]): void {
    formFields.forEach((field) => {
      if (field.fieldType === 'fieldset') {
        this.addFormControls((field as GnroFieldsetConfig).formFields);
      } else if (!this.form.get(field.fieldName!)) {
        this.form.addControl(field.fieldName!, new FormControl<string>({ value: '', disabled: !!field.readonly }, []));
        this.setValidators(field);
      }
    });
  }

  private setValidators(field: GnroFormField): void {
    const formField = this.form.get(field.fieldName!)!;

    if (field.validators) {
      formField.addValidators(field.validators);
    }

    if (field.required) {
      formField.addValidators(Validators.required);
    }

    if (field.fieldType === 'text' || field.fieldType === 'textarea' || field.fieldType === 'password') {
      const f = field as GnroTextFieldConfig;
      if (f.minLength || f.minLength === 0) {
        formField.addValidators(Validators.minLength(f.minLength));
      }
      if (f.maxLength || f.maxLength === 0) {
        formField.addValidators(Validators.maxLength(f.maxLength));
      }
    }

    if (field.fieldType === 'number') {
      const f = field as GnroNumberFieldConfig;
      if (f.minValue || f.minValue === 0) {
        formField.addValidators(Validators.min(f.minValue));
      }
      if (f.maxValue || f.maxValue === 0) {
        formField.addValidators(Validators.max(f.maxValue));
      }
    }
  }

  private getFieldType(key: string, formFields: GnroFormField[]): string {
    let fieldType = '';
    const find = formFields.find((field) => field.fieldName === key);
    if (find) {
      return find.fieldType;
    }
    formFields.forEach((field) => {
      if (field.fieldType === 'fieldset' && fieldType === '') {
        fieldType = this.getFieldType(key, (field as GnroFieldsetConfig).formFields);
      }
    });
    return fieldType;
  }

  get buttons(): GnroButtonConfg[] {
    return [...this.formConfig().buttons].map((button) => {
      return {
        ...button,
        hidden: this.buttonHidden(button),
        disabled: this.buttonDisabled(button),
      };
    });
  }

  getButtonTitle(item: GnroButtonConfg): string {
    return item.title === undefined ? item.name : item.title;
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => this.checkFormValueChanged(values));
    this.uploadFileService.uploadFiles = [];
  }

  private checkFormValueChanged(values: object): void {
    if (this.values() && Object.keys(this.values()!).length > 0) {
      isEqual(values, this.values()) ? this.form.markAsPristine() : this.form.markAsDirty();
      this.setFieldDirty(values, this.values()!);
      this.changeDetectorRef.markForCheck();
    }
  }

  private setFieldDirty<T>(values: object, orgValues: object): void {
    Object.keys(values).forEach((key) => {
      const formField = this.form.get(key)!;
      const isequal = isEqual((values as { [key: string]: T })[key], (orgValues as { [key: string]: T })[key]);
      if (isequal) {
        formField.markAsPristine();
      } else {
        formField.markAsDirty();
      }
    });
  }

  buttonHidden(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.View:
      case GnroButtonType.Reset:
      case GnroButtonType.Save:
        //case GnroButtonType.UploadFile:
        return !this.formSetting().editing;
      case GnroButtonType.Edit:
      default:
        return this.formSetting().editing;
    }
  }

  buttonDisabled(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.View:
        return this.form.dirty;
      case GnroButtonType.Reset:
        return !this.form.dirty;
      case GnroButtonType.Save:
        return !(this.form.dirty && this.form.valid);
      //case GnroButtonType.UploadFile:
      //  return !(this.form.dirty && this.form.valid && this.uploadFileService.uploadFiles.length > 0);
      case GnroButtonType.Edit:
      default:
        return false;
    }
  }

  buttonClick(button: GnroButtonConfg): void {
    this.formFacade.setFormEditable(this.formSetting().formId, button);
    switch (button.name) {
      case GnroButtonType.Edit:
        this.editForm(button);
        break;
      case GnroButtonType.Refresh:
        this.refreshForm();
        break;
      case GnroButtonType.Reset:
        this.resetForm();
        break;
      case GnroButtonType.Save:
        this.saveForm();
        break;
      //case GnroButtonType.UploadFile:
      //this.uploadFile();
      //  break;
      case GnroButtonType.View:
      default:
        break;
    }

    this.formButtonClick.emit({
      button: button,
      formData: this.form.getRawValue(),
    });
  }

  private editForm(button: GnroButtonConfg): void {
    this.checkFormValueChanged(this.form.getRawValue());
  }

  private refreshForm(): void {
    this.formFacade.getFormData(this.formSetting().formId, this.formConfig());
  }

  private resetForm(): void {
    this.form.patchValue({ ...this.values() });
    this.uploadFileService.uploadFiles = [];
    this.changeDetectorRef.markForCheck();
    //this.form.markAsPristine();
    //TODO reset
    this.form.reset();
  }

  private saveForm(): void {
    if (this.form.valid) {
      this.formFacade.saveFormData(this.formSetting().formId, this.formConfig(), this.form.getRawValue());
    }
  }
}
