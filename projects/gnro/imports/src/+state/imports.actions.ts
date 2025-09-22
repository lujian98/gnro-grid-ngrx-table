import { GnroUploadFile, GnroDataType } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GnroImportsResponse } from '../models/imports.model';

export const importsActions = createActionGroup({
  source: 'Imports',
  events: {
    'Open Window': props<{ stateId: string; urlKey: string }>(),
    'Close Window': emptyProps(),
    'Imports File': props<{ importsFileConfig: GnroFileUploadConfig; file: GnroUploadFile }>(),
    'Imports File Success': props<{ importsResponse: GnroImportsResponse }>(),
    'Reset Records': emptyProps(),
    'Delete Selected Records': props<{ selected: GnroDataType[] }>(),
    'Save Records': props<{ urlKey: string; records: GnroDataType[] }>(),
    'Save Records Success': props<{ urlKey: string }>(),
  },
});
