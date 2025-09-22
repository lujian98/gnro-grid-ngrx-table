import { createActionGroup, props } from '@ngrx/store';

export const systemPageConfigActions = createActionGroup({
  source: 'System Page Config',
  events: {
    Update: props<{ keyName: string; configType: string; configData: object }>(),
  },
});
