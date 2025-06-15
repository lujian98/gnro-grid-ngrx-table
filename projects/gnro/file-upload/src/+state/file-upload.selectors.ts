import { GnroGridData } from '@gnro/ui/grid';
import { createSelector } from '@ngrx/store';
import { FileUploadState, gnroFileUploadFeature } from './file-upload.reducer';
import { GnroFileUpload } from '../models/file-upload.model';

export const { selectGnroFileUploadState, selectUploadFiles } = gnroFileUploadFeature;

export const selectUploadFilesGridData = createSelector(selectGnroFileUploadState, (state: FileUploadState) => {
  const gridData: GnroGridData<GnroFileUpload> = {
    data: state.uploadFiles,
    totalCounts: state.uploadFiles.length,
  };
  return gridData;
});
