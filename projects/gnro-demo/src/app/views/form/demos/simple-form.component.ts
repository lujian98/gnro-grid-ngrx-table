import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccFormComponent, defaultFormConfig } from '@icc/ui/form';
import { IccFormField, IccFieldsetConfig } from '@icc/ui/fields';

@Component({
  selector: 'app-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccFormComponent],
})
export class AppSimpleFromDemoComponent {
  formConfig = {
    ...defaultFormConfig,
    labelWidth: 100,
  };

  remoteFormFields = {
    ...defaultFormConfig,
    urlKey: 'DCR',
    remoteFieldsConfig: true,
  };

  remoteFormFieldsAndValues = {
    ...defaultFormConfig,
    urlKey: 'DCR2',
    remoteFieldsConfig: true,
    remoteFormData: true,
  };

  allRemotes = {
    ...defaultFormConfig,
    urlKey: 'DCR3',
    remoteFormConfig: true,
  };

  formFields: IccFormField[] = [
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
    },
    {
      fieldType: 'text',
      fieldName: 'loginName',
      fieldLabel: 'Login Name',
    },
  ];

  fieldSet1: IccFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'test',
      legend: 'Local form config, fields and values',
      labelWidth: 80,
      //flexDirection: 'row',
      formFields: this.formFields,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      labelWidth: 80,
      fieldLabel: 'Email Address',
    },
  ];
  values = {
    userName: 'user 77 2222',
    loginName: 'test login88',
    email: 'test@email.com',
  };

  fieldSet2: IccFormField[] = [
    {
      fieldType: 'fieldset',
      fieldName: 'test',
      legend: 'Local form fields and values with default formConfig',
      labelWidth: 80,
      //flexDirection: 'row',
      formFields: this.formFields,
    },
    {
      fieldType: 'text',
      fieldName: 'email',
      labelWidth: 80,
      fieldLabel: 'Email Address',
    },
  ];
}
