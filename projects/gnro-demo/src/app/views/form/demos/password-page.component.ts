import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { confirmationValidator, GnroObjectType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroFormComponent } from '@gnro/ui/form';
import { STATES } from '../../../data/states';

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFormComponent],
})
export class AppPasswordPageDemoComponent {
  formConfig = {
    labelWidth: 150,
    autoFitHeight: false,
    validators: [confirmationValidator('userPassword', 'userPasswordConfirmation')],
  };

  formFields = [
    {
      fieldType: 'password',
      fieldName: 'userPassword',
      fieldLabel: 'User Password',
      //readonly: true,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    {
      fieldType: 'password',
      fieldName: 'userPasswordConfirmation',
      fieldLabel: 'User Password Confirmation',
      //readonly: true,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
  ];

  fieldSet: GnroFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      legend: 'Password Demo',
      formFields: this.formFields,
    },
  ];

  values = {
    userPassword: '',
    userPasswordConfirmation: '',
  };

  formConfig1 = {
    labelWidth: 100,
    autoFitHeight: false,
  };

  formConfig2 = {
    labelWidth: 100,
  };

  formFields3: GnroFormField[] = [
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

  fieldSet3: GnroFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      legend: 'Readonly field Demo',
      formFields: this.formFields3,
    },
  ];

  values3 = {
    enabled: true,
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
    password: '',
    age: 18,
    state: STATES[32],
    createdate: new Date(new Date().setHours(0, 0, 0, 0)),
    notes: 'This is a notes. ',
    group83: 'B',
    uploadfile: '',
  };

  formFields4: GnroFormField[] = [
    {
      fieldType: 'checkbox',
      fieldName: 'enabled',
      fieldLabel: 'Enabled',
      //required: true,
      readonlyFields: [
        'userName',
        'loginName',
        'password',
        'email',
        'age',
        'state',
        'notes',
        'createdate',
        'uploadfile',
        'group82',
      ],
    },
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
      required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'text',
      fieldName: 'loginName',
      fieldLabel: 'Login Name',
      required: true,
    },
    {
      fieldType: 'number',
      fieldName: 'age',
      fieldLabel: 'Age',
      //required: true,
      minValue: 0,
      maxValue: 100,
      clearValue: true,
    },
    {
      fieldType: 'password',
      fieldName: 'password',
      fieldLabel: 'User Password',
      //required: true,
      minLength: 4,
      maxLength: 20,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      fieldLabel: 'Email Address',
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
      placeholder: 'Select One or More...',
    },
    {
      fieldType: 'textarea',
      fieldName: 'notes',
      fieldLabel: 'Notes',
      //required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'date',
      fieldName: 'createdate',
      fieldLabel: 'Create Date',
      //required: true,
    },
    {
      fieldType: GnroObjectType.UploadFile,
      fieldName: 'uploadfile',
      fieldLabel: 'Upload File',
      //required: true,
    },
    {
      fieldType: GnroObjectType.RadioGroup,
      fieldName: 'group82',
      fieldLabel: 'Radio Group',
      //required: true,
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

  fieldSet4: GnroFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      legend: 'Checkbox enable edit/readonly Demo',
      formFields: this.formFields4,
    },
  ];

  values4 = {
    enabled: true,
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
    password: '',
    age: 18,
    state: STATES[32],
    createdate: new Date(new Date().setHours(0, 0, 0, 0)),
    notes: 'This is a notes. ',
    group82: 'B',
    uploadfile: '',
  };

  formFields5: GnroFormField[] = [
    {
      fieldType: 'checkbox',
      fieldName: 'enabled',
      fieldLabel: 'Enabled',
      hidden: true,
      required: true,
    },
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
      hidden: true,
      required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'text',
      fieldName: 'loginName',
      fieldLabel: 'Login Name',
      hidden: true,
      required: true,
    },
    {
      fieldType: 'number',
      fieldName: 'age',
      fieldLabel: 'Age',
      hidden: true,
      minValue: 0,
      maxValue: 100,
      clearValue: true,
    },
    {
      fieldType: 'password',
      fieldName: 'password',
      fieldLabel: 'User Password',
      hidden: true,
      minLength: 4,
      maxLength: 20,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      fieldLabel: 'Email Address',
      hidden: true,
    },
    {
      fieldType: 'select',
      hidden: true,
      remoteOptions: true,
      urlKey: 'usa',
      fieldName: 'state',
      multiSelection: false,
      fieldLabel: 'State',
      optionLabel: 'state',
      optionKey: 'abbr',
      placeholder: 'Select One or More...',
    },
    {
      fieldType: 'textarea',
      hidden: true,
      fieldName: 'notes',
      fieldLabel: 'Notes',
      //required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'date',
      hidden: true,
      fieldName: 'createdate',
      fieldLabel: 'Create Date',
      //required: true,
    },
    {
      fieldType: GnroObjectType.UploadFile,
      hidden: true,
      fieldName: 'uploadfile',
      fieldLabel: 'Upload File',
      //required: true,
    },
    {
      fieldType: 'display',
      fieldName: 'display',
      fieldLabel: 'display',
      hidden: true,
    },
    {
      fieldType: GnroObjectType.RadioGroup,
      hidden: true,
      fieldName: 'group81',
      fieldLabel: 'Radio Group',
      //required: true,
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

  fieldSet5: GnroFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      legend: 'Checkbox hidden Demo',
      formFields: this.formFields5,
    },
  ];

  values5 = {
    enabled: true,
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
    password: '',
    age: 18,
    state: STATES[32],
    display: 'display field',
    createdate: new Date(new Date().setHours(0, 0, 0, 0)),
    notes: 'This is a notes. ',
    group81: 'B',
    uploadfile: '',
  };

  formFields6: GnroFormField[] = [
    {
      fieldType: 'checkbox',
      fieldName: 'enabled',
      fieldLabel: 'Enabled',
      required: true,
      readonlyFields: [
        'userName',
        'loginName',
        'password',
        'email',
        'age',
        'state',
        'display',
        'notes',
        'createdate',
        'uploadfile',
        'group86',
        'checkboxtest',
      ],
    },
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
      required: true,
      readonlyHidden: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'text',
      fieldName: 'loginName',
      fieldLabel: 'Login Name',
      readonlyHidden: true,
      required: true,
    },
    {
      fieldType: 'number',
      fieldName: 'age',
      fieldLabel: 'Age',
      readonlyHidden: true,
      minValue: 0,
      maxValue: 100,
      clearValue: true,
    },
    {
      fieldType: 'password',
      fieldName: 'password',
      fieldLabel: 'User Password',
      readonlyHidden: true,
      minLength: 4,
      maxLength: 20,
    },
    {
      fieldType: 'checkbox',
      fieldName: 'checkboxtest',
      fieldLabel: 'Checkbox Test',
      readonlyHidden: true,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      fieldLabel: 'Email Address',
      readonlyHidden: true,
    },
    {
      fieldType: 'select',
      remoteOptions: true,
      urlKey: 'usa',
      fieldName: 'state',
      multiSelection: false,
      fieldLabel: 'State',
      readonlyHidden: true,
      optionLabel: 'state',
      optionKey: 'abbr',
      placeholder: 'Select One or More...',
    },
    {
      fieldType: 'textarea',
      fieldName: 'notes',
      fieldLabel: 'Notes',
      readonlyHidden: true,
      //required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'date',
      fieldName: 'createdate',
      fieldLabel: 'Create Date',
      readonlyHidden: true,
      //required: true,
    },
    {
      fieldType: GnroObjectType.UploadFile,
      fieldName: 'uploadfile',
      fieldLabel: 'Upload File',
      readonlyHidden: true,
      //required: true,
    },
    {
      fieldType: 'display',
      fieldName: 'display',
      fieldLabel: 'display',
      readonlyHidden: true,
    },
    {
      fieldType: GnroObjectType.RadioGroup,
      fieldName: 'group86',
      fieldLabel: 'Radio Group',
      readonlyHidden: true,
      //required: true,
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

  fieldSet6: GnroFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      legend: 'Checkbox visile fields Demo',
      formFields: this.formFields6,
    },
  ];

  values6 = {
    enabled: true,
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
    password: '',
    age: 18,
    state: STATES[32],
    display: 'display field',
    createdate: new Date(new Date().setHours(0, 0, 0, 0)),
    notes: 'This is a notes. ',
    group86: 'A',
    uploadfile: '',
    checkboxtest: true,
  };
}
