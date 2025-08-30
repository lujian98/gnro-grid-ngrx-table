import { GnroGridData } from '@gnro/ui/grid';
import { createSelector } from '@ngrx/store';
import { gnroImportsFeature } from './imports.reducer';
//import { GnroFileUpload } from '../models/file-upload.model';

export const { selectStateId, selectImportedExcelData } = gnroImportsFeature;

/*
export const selectUploadFilesGridData = createSelector(selectGnroFileUploadState, (state: FileUploadState) => {
  const gridData: GnroGridData<GnroFileUpload> = {
    data: state.uploadFiles,
    totalCounts: state.uploadFiles.length,
  };
  return gridData;
});
*/
