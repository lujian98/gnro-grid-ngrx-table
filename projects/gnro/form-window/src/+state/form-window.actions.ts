import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GnroFormWindowConfig } from '../models/form-window.model';

export const formWindowActions = createActionGroup({
  source: '[Form Window]',
  events: {
    Open: props<{ stateId: string; formWindowConfig: GnroFormWindowConfig }>(),
    Close: emptyProps(),
    Save: props<{ values: object }>(),
    'Save Success': props<{ stateId: string; keyName: string }>(),
  },
});
