import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroObjectType } from '@gnro/ui/core';
import { GnroFieldsetLabelWidthDirective, GnroFieldWidthDirective } from '@gnro/ui/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroFieldsComponent } from '../fields.component';
import { GnroFormField } from '../models/fields.model';
import { defaultFieldsetConfig, GnroFieldsetConfig } from './models/fieldset.model';

@Component({
  selector: 'gnro-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    GnroFieldsComponent,
    GnroFieldsetLabelWidthDirective,
    GnroFieldWidthDirective,
  ],
})
export class GnroFieldsetComponent {
  FieldType = GnroObjectType;
  form = input.required<FormGroup>();
  fieldConfig = input.required({
    transform: (fieldConfig: Partial<GnroFieldsetConfig>) => {
      const formConfig = { ...defaultFieldsetConfig, ...fieldConfig };
      return formConfig;
    },
  });

  get formFields(): GnroFormField[] {
    return this.fieldConfig().formFields;
  }
}
