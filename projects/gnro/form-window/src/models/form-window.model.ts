import { GrnoDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroFormConfig } from '@gnro/ui/form';
import { GnroWindowConfig } from '@gnro/ui/window';

export interface GnroFormWindowConfig {
  windowConfig: GnroWindowConfig;
  formConfig: Partial<GnroFormConfig>;
  formFields: GnroFormField[];
  values?: GrnoDataType;
}
