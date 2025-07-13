import { createAction, props } from '@ngrx/store';

export const updateSystemPageConfigConfig = createAction(
  '[System Page Config] Update System Page Config',
  props<{ keyName: string; configType: string; configData: object }>(),
);

export const updateSystemPageConfigConfigSucessful = createAction(
  '[System Page Config]  Update System Page Config Sucessful',
);
