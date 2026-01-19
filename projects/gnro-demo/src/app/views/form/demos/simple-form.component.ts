import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GnroFormComponent, defaultFormConfig } from '@gnro/ui/form';
import { GnroFormField, GnroFieldsetConfig } from '@gnro/ui/fields';

@Component({
  selector: 'app-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFormComponent],
})
export class AppSimpleFromDemoComponent {
  formConfig = {
    ...defaultFormConfig,
    formName: 'form1',
    labelWidth: 100,
  };

  formConfig2 = {
    ...defaultFormConfig,
    formName: 'form2',
    labelWidth: 100,
  };

  remoteFormFields = {
    ...defaultFormConfig,
    formName: 'formr',
    urlKey: 'DCR',
    remoteFieldsConfig: true,
  };

  remoteFormFieldsAndValues = {
    ...defaultFormConfig,
    formName: 'formrv',
    urlKey: 'DCR2',
    remoteFieldsConfig: true,
    remoteFormData: true,
  };

  allRemotes = {
    ...defaultFormConfig,
    formName: 'formar',
    urlKey: 'DCR3',
    remoteFormConfig: true,
  };

  formFields: GnroFormField[] = [
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

  fieldSet1: GnroFormField[] = [
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

  fieldSet2: GnroFormField[] = [
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
