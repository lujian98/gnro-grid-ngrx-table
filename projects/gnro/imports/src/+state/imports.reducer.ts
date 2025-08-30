import { createFeature, createReducer, on } from '@ngrx/store';
import { openRemoteImportsWindowAction, importsFileSuccessAction } from './imports.actions';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUpload } from '@gnro/ui/file-upload';
import { GnroGridData } from '@gnro/ui/grid';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  importedExcelData: GnroGridData<object> | undefined;
  //importsFile: GnroFileUpload | undefined;
}

export const initialState: ImportsState = {
  stateId: '',
  importedExcelData: undefined,
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
    on(importsFileSuccessAction, (state, action) => {
      return {
        ...state,
        importedExcelData: action.gridData,
      };
    }),
  ),
});
