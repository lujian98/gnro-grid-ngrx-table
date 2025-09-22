import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GnroFileUploadConfig } from '../models/file-upload.model';

export const fileUploadActions = createActionGroup({
  source: 'File Upload',
  events: {
    'Drop File': props<{ relativePath: string; file: File }>(),
    Upload: props<{ fileUploadConfig: GnroFileUploadConfig }>(),
    'Upload Success': emptyProps(),
    'Clear Files': emptyProps(),
    'Select File': props<{ fieldName: string; file: File }>(),
    'Clear Selected File': props<{ fieldName: string }>(),
  },
});
