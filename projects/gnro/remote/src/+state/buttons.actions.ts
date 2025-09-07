import { GnroButtonConfg, GrnoDataType } from '@gnro/ui/core';
import { createActionGroup, props } from '@ngrx/store';

export const remoteButtonActions = createActionGroup({
  source: '[Remote Button]',
  events: {
    Click: props<{ button: GnroButtonConfg; keyName: string; configType: string; formData: GrnoDataType }>(),
  },
});
