import { createAction, props } from '@ngrx/store';

export const updateSystemPageConfigConfigAction = createAction(
  '[System Page Config] Update System Page Config',
  props<{ keyName: string; configType: string; configData: object }>(),
);
