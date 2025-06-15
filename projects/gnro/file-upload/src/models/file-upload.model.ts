import { GnroUploadFile } from '@gnro/ui/core';

export interface GnroFileUpload extends GnroUploadFile {
  filename: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface GnroFileUploadConfig {
  urlKey: string;
  fileDir: string; // default to urlKey if not defined
  maxSelectUploads: number; // for file select upload only
}

export const defaultFileUploadConfig: GnroFileUploadConfig = {
  urlKey: 'upload',
  fileDir: 'upload',
  maxSelectUploads: 5,
};
