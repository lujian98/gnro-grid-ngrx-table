import { GnroGridData } from '@gnro/ui/grid';
import { createFeature, createReducer, on } from '@ngrx/store';
import { importsFileSuccessAction, openRemoteImportsWindowAction } from './imports.actions';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  importedExcelData: GnroGridData<object> | undefined;
}

export const initialState: ImportsState = {
  stateId: '',
  importedExcelData: undefined,
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
