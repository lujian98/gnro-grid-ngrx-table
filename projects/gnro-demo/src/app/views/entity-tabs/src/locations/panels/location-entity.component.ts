import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-location-entity',
  templateUrl: './location-entity.component.html',
  styleUrls: ['./location-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GnroButtonComponent,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    FormsModule,
    GnroTextFieldComponent,
  ],
})
export class AppLocationEntityComponent implements OnInit {
  form: FormGroup = new FormGroup({
    vin: new FormControl('field A'),
  });

  fieldConfig: GnroTextFieldConfig = {
    ...defaultTextFieldConfig,
    fieldName: 'vin',
    fieldLabel: 'Vin',
    labelWidth: 120,
    clearValue: true,
    editable: true,
  };

  ngOnInit(): void {
    const formvalues = {
      vin: '642b3edc',
    };
    this.form.patchValue(formvalues);
  }
}
