import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GnroMessageActions = createActionGroup({
  source: '[Message]',
  events: {
    Show: props<{ action: string; keyName: string; configType: string }>(),
    End: emptyProps(),
  },
});
