export const DCRFormConfig = {
  readonly: true,
  remoteFieldsConfig: true,
  remoteFormData: true,
};

export const DCRFormFields0 = [
  {
    fieldType: 'text',
    fieldName: 'userName',
    fieldLabel: 'User Remote',
  },
  {
    fieldType: 'text',
    fieldName: 'loginName',
    fieldLabel: 'Login Name',
  },
];

export const DCRFormFields = [
  {
    fieldType: 'fieldset',
    fieldName: 'test',
    legend: 'Remote form fields, and local values',
    labelWidth: 80,
    formFields: DCRFormFields0,
  },
];

export const DCRFormData = {
  formConfig: {
    readonly: false,
  },
  formData: {
    userName: 'R2 user 77 2222',
    loginName: 'R2 test login88',
  },
};

export const DCR2FormFields = [
  {
    fieldType: 'fieldset',
    fieldName: 'test',
    legend: 'Remote form fields and values',
    labelWidth: 80,
    formFields: DCRFormFields0,
  },
];

export const DCR2FormData = {
  formConfig: {
    readonly: false,
  },
  formData: {
    userName: 'R2 user 77 2222',
    loginName: 'R2 test login88',
  },
};

export const DCR3FormConfig = {
  readonly: true,
  remoteFieldsConfig: true,
  remoteFormData: true,
};

export const DCR3FormFields = [
  {
    fieldType: 'fieldset',
    fieldName: 'test',
    legend: 'All Remotes',
    labelWidth: 80,
    formFields: DCRFormFields0,
  },
];

export const DCR3FormData = {
  formConfig: {
    readonly: false,
  },
  formData: {
    userName: 'R2 user 77 2222',
    loginName: 'R2 test login88',
  },
};
