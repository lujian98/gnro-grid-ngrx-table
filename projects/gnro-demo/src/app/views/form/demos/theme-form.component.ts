import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroFormComponent } from '@gnro/ui/form';
import { STATES } from '../../../data/states';

@Component({
  selector: 'app-theme-form',
  templateUrl: './theme-form.component.html',
  styleUrls: ['./theme-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFormComponent, ReactiveFormsModule],
})
export class AppThemeFormDemoComponent {
  formConfig = {
    labelWidth: 100,
  };

  fieldSet: GnroFormField[] = [
    {
      fieldType: 'text',
      fieldName: 'userName',
      fieldLabel: 'User Name',
      required: true,
      clearValue: true,
    },
    /*



        {
      fieldType: 'date',
      fieldName: 'createdate',
      fieldLabel: 'Create Date',
      required: true,
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
      fieldType: GnroObjectType.RadioGroup,
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
      fieldType: GnroObjectType.UploadFile,
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
    */
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
}
