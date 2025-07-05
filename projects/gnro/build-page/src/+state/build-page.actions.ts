import { createAction, props } from '@ngrx/store';

export const updateBuildPageConfig = createAction(
  '[Build Page] Update Build Page Config',
  props<{ keyName: string; configType: string; configData: object }>(),
);

export const updateBuildPageConfigSucessful = createAction('[Build Page]  Update Build Page Config Sucessful');
