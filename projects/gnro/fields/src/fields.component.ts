import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroObjectType } from '@gnro/ui/core';
import { GnroCheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { GnroDateFieldComponent } from './date-field/date-field.component';
import { GnroDateRangeFieldComponent } from './date-range-field/date-range-field.component';
import { GnroDisplayFieldComponent } from './display-field/display-field.component';
import { GnroHiddenFieldComponent } from './hidden-field/hidden-field.component';
import { GnroFormField } from './models/fields.model';
import { GnroNumberFieldComponent } from './number-field/number-field.component';
import { GnroPasswordFieldComponent } from './password-field/password-field.component';
import { GnroRadioGroupFieldComponent } from './radio-group-field/radio-group-field.component';
import { GnroSelectFieldComponent } from './select-field/select-field.component';
import { GnroTextFieldComponent } from './text-field/text-field.component';
import { GnroTextareaFieldComponent } from './textarea-field/textarea-field.component';
import { GnroUploadFileFieldComponent } from './upload-file-field/upload-file-field.component';

@Component({
  selector: 'gnro-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    GnroTextFieldComponent,
    GnroNumberFieldComponent,
    GnroPasswordFieldComponent,
    GnroTextareaFieldComponent,
    GnroSelectFieldComponent,
    GnroDisplayFieldComponent,
    GnroDateFieldComponent,
    GnroDateRangeFieldComponent,
    GnroCheckboxFieldComponent,
    GnroRadioGroupFieldComponent,
    GnroHiddenFieldComponent,
    GnroUploadFileFieldComponent,
  ],
})
export class GnroFieldsComponent {
  FieldType = GnroObjectType;
  form = input.required<FormGroup>();
  fieldConfig = input.required<Partial<GnroFormField>>();
}
