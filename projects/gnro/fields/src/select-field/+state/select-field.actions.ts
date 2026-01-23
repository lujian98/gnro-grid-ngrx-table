import { createActionGroup, props } from '@ngrx/store';
import { GnroOptionType, GnroSelectFieldConfig } from '../models/select-field.model';

export const selectFieldActions = createActionGroup({
  source: 'Select Field',
  events: {
    'Init Config': props<{ fieldName: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Remote Config': props<{ fieldName: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Config Success': props<{ fieldName: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Options': props<{ fieldName: string; fieldConfig: GnroSelectFieldConfig }>(),
    'Load Options Success': props<{ fieldName: string; options: GnroOptionType[] }>(),
    'Clear Store': props<{ fieldName: string }>(),
    'Remove Store': props<{ fieldName: string }>(),
  },
});
