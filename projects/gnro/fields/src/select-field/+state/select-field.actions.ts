import { createActionGroup, props } from '@ngrx/store';
import { GnroOptionType, GnroSelectFieldConfig } from '../models/select-field.model';

export const selectFieldActions = createActionGroup({
  source: '[SelectField]',
  events: {
    'Init Config': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Remote Config': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Config Success': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Options': props<{ fieldId: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Options Success': props<{ fieldId: string; options: GnroOptionType[] }>(),
    'Clear Store': props<{ fieldId: string }>(),
    'Remove Store': props<{ fieldId: string }>(),
  },
});
