import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccObjectType } from '@icc/ui/core';
import { IccFormField } from '@icc/ui/fields';
import { IccFormComponent } from '@icc/ui/form';
import { STATES } from '../../../data/states';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccFormComponent],
})
export class AppFromPageDemoComponent {
  formConfig = {
    title: 'Edit User',
    labelWidth: 100,
  };

  formFields2: IccFormField[] = [
    {
      fieldType: 'text',
      fieldName: 'userName2',
      fieldLabel: 'User Name2',
    },
    {
      fieldType: 'text',
      fieldName: 'loginName2',
      fieldLabel: 'Login Name2',
      fieldWidth: 80,
    },
  ];

  formFields = [
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
      fieldType: 'fieldset',
      fieldName: 'fieldset',
      flexDirection: 'row',
      formFields: this.formFields2,
    },
  ];

  fieldSet: IccFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'test',
      legend: 'Local form config, fields and values',
      //flexDirection: 'row',
      formFields: this.formFields,
    },
    {
      fieldType: 'number',
      fieldName: 'age',
      fieldLabel: 'Age',
      required: true,
      minValue: 0,
      maxValue: 100,
      clearValue: true,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      fieldLabel: 'Email Address',
    },
    {
      fieldType: 'textarea',
      fieldName: 'notes',
      fieldLabel: 'Notes',
      required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'display',
      fieldName: 'display',
      fieldLabel: 'display',
    },
    {
      fieldType: 'date',
      fieldName: 'createdate',
      fieldLabel: 'Create Date',
      required: true,
    },
    {
      fieldType: 'hidden',
      fieldName: 'totalValue',
    },
    {
      fieldType: 'checkbox',
      fieldName: 'enabled',
      fieldLabel: 'Enabled',
      required: true,
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
      placeholder: 'Select One or More...',
    },
    {
      fieldType: IccObjectType.RadioGroup,
      fieldName: 'group1',
      fieldLabel: 'Radio Group',
      required: true,
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
    {
      fieldType: IccObjectType.UploadFile,
      fieldName: 'uploadfile',
      fieldLabel: 'Upload File',
      required: true,
    },
    {
      fieldType: 'password',
      fieldName: 'userPassword',
      fieldLabel: 'Password',
      required: true,
      minLength: 4,
      maxLength: 20,
    },
  ];

  values = {
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
    age: 18,
    notes: 'This is a notes. ',
    state: STATES[32],
    display: 'display only',
    createdate: new Date(new Date().setHours(0, 0, 0, 0)),
    enabled: true,
    totalValue: 123892,
    userName2: 'user 77 A33',
    loginName2: 'test login A33',
    group1: 'B',
    uploadfile: '',
    userPassword: '',
  };

  formConfig3 = {
    labelWidth: 100,
  };

  formFields3: IccFormField[] = [
    {
      fieldType: 'checkbox',
      fieldName: 'enabled',
      fieldLabel: 'Enabled',
      required: true,
      requiredFields: [
        'userName',
        'loginName',
        'password',
        'email',
        'age',
        'state',
        'notes',
        'createdate',
        'uploadfile',
        'group88',
      ],
    },
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
      //required: true,
      minLength: 4,
      maxLength: 20,
      clearValue: true,
    },
    {
      fieldType: 'text',
      fieldName: 'loginName',
      fieldLabel: 'Login Name',
      //required: true,
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
      fieldType: IccObjectType.UploadFile,
      fieldName: 'uploadfile',
      fieldLabel: 'Upload File',
      //required: true,
    },
    {
      fieldType: IccObjectType.RadioGroup,
      fieldName: 'group88',
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

  fieldSet3: IccFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'fieldSet',
      legend: 'Checkbox enable required Demo',
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
    group88: 'A',
    uploadfile: '',
  };
}
