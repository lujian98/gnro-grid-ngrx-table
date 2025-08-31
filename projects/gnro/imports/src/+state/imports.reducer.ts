import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  importsFileSuccessAction,
  openRemoteImportsWindowAction,
  resetImportsDataAction,
  deleteImportsSelectedAction,
} from './imports.actions';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  importedExcelData: GnroGridData<object> | undefined;
  columnsConfig: GnroColumnConfig[];
}

export const initialState: ImportsState = {
  stateId: '',
  importedExcelData: undefined,
  columnsConfig: [],
};

export const gnroImportsFeature = createFeature({
  name: 'gnroImports',
  reducer: createReducer(
    initialState,
    on(openRemoteImportsWindowAction, (state, action) => {
      return {
        ...state,
        stateId: action.stateId,
        importedExcelData: undefined,
        columnsConfig: [],
      };
    }),
    on(importsFileSuccessAction, (state, action) => {
      return {
        ...state,
        importedExcelData: action.importedExcelData,
        columnsConfig: action.columnsConfig,
      };
    }),
    on(resetImportsDataAction, (state) => {
      return {
        ...state,
        importedExcelData: { data: [], totalCounts: 0 },
      };
    }),
    on(deleteImportsSelectedAction, (state, action) => {
      const data = state.importedExcelData?.data;
      // TODO delete records
      return {
        ...state,
        importedExcelData: { data: [], totalCounts: 0 },
      };
    }),
  ),
});
