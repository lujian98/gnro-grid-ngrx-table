import { GnroFormField } from '@gnro/ui/fields';
import { GnroColumnConfig, GnroGridConfig } from '../models/grid.model';
import { GnroObjectType } from '@gnro/ui/core';

export function getFormFields(gridConfig: GnroGridConfig, columnsConfig: GnroColumnConfig[]): GnroFormField[] {
  return columnsConfig.map((column) => {
    const rendererFieldConfig = column.rendererFieldConfig ? column.rendererFieldConfig : {};
    const fieldType = getFormFieldType(column);
    const field = {
      fieldName: column.name,
      fieldLabel: column.title || column.name,
      fieldType,
      readonly: true,
      required: false,
      ...rendererFieldConfig,
    };
    if (fieldType === GnroObjectType.Select) {
      return {
        ...field,
        urlKey: gridConfig.urlKey,
      };
    }
    return field;
  });
}

function getFormFieldType(column: GnroColumnConfig): GnroObjectType {
  if (!column.cellEditable) {
    return GnroObjectType.Display;
  } else if (!column.rendererType) {
    return GnroObjectType.Text;
  }
  return column.rendererType;
}
