import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GnroFormWindowConfig } from '../models/form-window.model';

export const formWindowActions = createActionGroup({
  source: '[Form Window]',
  events: {
    Open: props<{ stateId: string; formWindowConfig: GnroFormWindowConfig }>(),
    Close: emptyProps(),
    //Save: props<{ values: GnroDataType }>(), //not used here
    'Save Success': props<{ stateId: string; keyName: string }>(),
  },
});
