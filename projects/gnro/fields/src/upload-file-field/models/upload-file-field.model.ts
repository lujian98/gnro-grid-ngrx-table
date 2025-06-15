import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroUploadFileFieldConfig extends GnroBaseField {}

export const defaultUploadFileFieldConfig: GnroUploadFileFieldConfig = {
  fieldType: GnroObjectType.UploadFile,
  fieldName: 'uploadfilefield',
  ...defaultBaseField,
};
