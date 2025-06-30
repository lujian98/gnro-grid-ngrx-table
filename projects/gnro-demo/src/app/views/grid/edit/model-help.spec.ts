import { GnroObjectType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroWindowConfig, defaultWindowConfig } from '@gnro/ui/window';

export const MockWindowConfig: GnroWindowConfig = {
  ...defaultWindowConfig,
  title: 'Grid Form Window Inputs',
  //height: '480px',
};

export const MockFormConfig = {
  labelWidth: 150,
};

const formFields: GnroFormField[] = [
  {
    fieldType: 'checkbox',
    fieldName: 'enabled',
    fieldLabel: 'Enabled',
    readonly: true,
    required: true,
  },
  {
    fieldType: 'text',
    fieldName: 'userName',
    fieldLabel: 'User Name',
    readonly: true,
    required: true,
    minLength: 4,
    maxLength: 20,
    clearValue: true,
  },
  {
    fieldType: 'text',
    fieldName: 'loginName',
    fieldLabel: 'Login Name',
    readonly: true,
  },
  {
    fieldType: 'number',
    fieldName: 'age',
    fieldLabel: 'Age',
    readonly: true,
    minValue: 0,
    maxValue: 100,
    clearValue: true,
  },
  {
    fieldType: 'password',
    fieldName: 'password',
    fieldLabel: 'User Password',
    readonly: true,
    minLength: 4,
    maxLength: 20,
  },
  {
    fieldType: 'text',
    fieldName: 'email',
    fieldLabel: 'Email Address',
    readonly: true,
  },
  {
    fieldType: 'select',
    remoteOptions: true,
    urlKey: 'usa',
    fieldName: 'state',
    multiSelection: false,
    fieldLabel: 'State',
    optionLabel: 'state',
    optionKey: 'abbr',
    required: true,
    readonly: true,
    placeholder: 'Select One or More...',
  },
  {
    fieldType: 'textarea',
    fieldName: 'notes',
    fieldLabel: 'Notes',
    readonly: true,
    clearValue: true,
  },
  {
    fieldType: 'date',
    fieldName: 'createdate',
    fieldLabel: 'Create Date',
    readonly: true,
  },
  {
    fieldType: GnroObjectType.UploadFile,
    fieldName: 'uploadfile',
    fieldLabel: 'Upload File',
    readonly: true,
  },
  {
    fieldType: GnroObjectType.RadioGroup,
    fieldName: 'group83',
    fieldLabel: 'Radio Group',
    //readonly: true,
    groups: [
      {
        title: 'Group A',
        name: 'A',
      },
      {
        title: 'Group B',
        name: 'B',
      },
      {
        title: 'Group C',
        name: 'C',
      },
    ],
  },
];

export const MockFormFields: GnroFormField[] = [
  {
    fieldType: 'fieldset',
    fieldName: 'fieldset',
    legend: 'Readonly field Demo',
    formFields: formFields,
  },
];

export const MockValues = {
  enabled: true,
  userName: 'user 77 2222',
  loginName: 'test login88',
  email: 'test@email.com',
  password: '',
  age: 18,
  state: { abbr: 'NY', country: 'USA', state: 'New York', description: 'Empire State' },
  createdate: new Date(new Date().setHours(0, 0, 0, 0)),
  notes: 'This is a notes. ',
  group83: 'B',
  uploadfile: '',
};
