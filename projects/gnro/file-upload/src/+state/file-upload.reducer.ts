import { GnroUploadFile } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import { fileUploadActions } from './file-upload.actions';

export interface FileUploadState {
  uploadFiles: GnroUploadFile[];
}

export const initialState: FileUploadState = {
  uploadFiles: [],
};

export function getFileUpload(fieldName: string, file: File, relativePath: string): GnroUploadFile {
  return {
    fieldName: fieldName,
    relativePath: relativePath,
    file: file,
    filename: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
  };
}

export const gnroFileUploadFeature = createFeature({
  name: 'gnroFileUpload',
  reducer: createReducer(
    initialState,
    on(fileUploadActions.dropFile, (state, { relativePath, file }) => {
      const fieldName = `file_drop_upload_${state.uploadFiles.length + 1}`;
      return {
        ...state,
        uploadFiles: [...state.uploadFiles, getFileUpload(fieldName, file, relativePath)],
      };
    }),
    on(fileUploadActions.selectFile, (state, { fieldName, file }) => {
      const uploadFiles = [...state.uploadFiles].filter((item) => item.fieldName !== fieldName);
      return {
        ...state,
        uploadFiles: [...uploadFiles, getFileUpload(fieldName, file, '')],
      };
    }),
    on(fileUploadActions.clearSelectedFile, (state, { fieldName }) => {
      return {
        ...state,
        uploadFiles: [...state.uploadFiles].filter((item) => item.fieldName !== fieldName),
      };
    }),
    on(fileUploadActions.uploadSuccess, fileUploadActions.clearFiles, (state) => ({
      ...state,
      uploadFiles: [],
    })),
  ),
});
