import { createActionGroup, createAction, props, emptyProps } from '@ngrx/store';
import { GnroSelectFieldConfig, GnroOptionType } from '../models/select-field.model';

export const selectFieldActions = createActionGroup({
  source: '[SelectField]',
  events: {
    'Init Field Config': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Remote Field Config': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Field Config Success': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Select Field Options': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Select Field Options Success': props<{ fieldId: string; options: GnroOptionType[] }>(),
    'Clear Select Field Store': props<{ fieldId: string }>(),
    'Remove Select Field Store': props<{ fieldId: string }>(),
  },
});

/*

export const initFieldConfig = createAction(
  '[SelectField] Init Field Config',
  props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
);

export const loadRemoteFieldConfig = createAction(
  '[SelectField] Load Remote Field Config',
  props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
);

export const loadFieldConfigSuccess = createAction(
  '[SelectField] Load Field Config Success',
  props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
);

export const loadSelectFieldOptions = createAction(
  '[SelectField] Load Select Field Options',
  props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
);

export const loadSelectFieldOptionsSuccess = createAction(
  '[SelectField] Load Select Field Options Success',
  props<{ fieldId: string; options: GnroOptionType[] }>(),
);

export const clearSelectFieldStore = createAction(
  '[SelectField]] Clear Select Field Store',
  props<{ fieldId: string }>(),
);
export const removeSelectFieldStore = createAction(
  '[SelectField]] Remove Select Field Store',
  props<{ fieldId: string }>(),
);
*/
