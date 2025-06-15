import { GnroCheckboxFieldConfig } from '../checkbox-field/models/checkbox-field.model';
import { GnroDateFieldConfig } from '../date-field/models/date-field.model';
import { GnroDateRangeFieldConfig } from '../date-range-field/models/date-range-field.model';
import { GnroDisplayFieldConfig } from '../display-field/models/display-field.model';
import { GnroFieldsetConfig } from '../fieldset/models/fieldset.model';
import { GnroHiddenFieldConfig } from '../hidden-field/models/hidden-field.model';
import { GnroNumberFieldConfig } from '../number-field/models/number-field.model';
import { GnroPasswordFieldConfig } from '../password-field/models/password-field.model';
import { GnroRadioGroupFieldConfig } from '../radio-group-field/models/radio-group-field.model';
import { GnroSelectFieldConfig } from '../select-field/models/select-field.model';
import { GnroTextFieldConfig } from '../text-field/models/text-field.model';
import { GnroTextareaFieldConfig } from '../textarea-field/models/textarea-field.model';
import { GnroUploadFileFieldConfig } from '../upload-file-field/models/upload-file-field.model';
import { GnroBaseField } from './base-field.model';

export type GnroFormField =
  | GnroBaseField
  | GnroCheckboxFieldConfig
  | GnroDateFieldConfig
  | GnroDateRangeFieldConfig
  | GnroDisplayFieldConfig
  | GnroFieldsetConfig
  | GnroHiddenFieldConfig
  | GnroNumberFieldConfig
  | GnroPasswordFieldConfig
  | GnroRadioGroupFieldConfig
  | GnroSelectFieldConfig
  | GnroTextFieldConfig
  | GnroTextareaFieldConfig
  | GnroUploadFileFieldConfig;

export type GnroFieldConfig = Partial<GnroFormField>;
