import { createFeature, createReducer, on } from '@ngrx/store';
import { openRemoteImportsWindowAction } from './imports.actions';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUpload } from '@gnro/ui/file-upload';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  //importsFile: GnroFileUpload | undefined;
}

export const initialState: ImportsState = {
  stateId: '',
  //importsFile: undefined
};

export const gnroImportsFeature = createFeature({
  name: 'gnroImports',
  reducer: createReducer(
    initialState,
    on(openRemoteImportsWindowAction, (state, action) => {
      return {
        ...state,
        stateId: action.stateId,
      };
    }),
  ),
});
