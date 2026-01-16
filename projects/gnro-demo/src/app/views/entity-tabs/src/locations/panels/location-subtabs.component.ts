import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroNumberFieldComponent, GnroNumberFieldConfig, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroTabComponent, GnroTabGroupComponent } from '@gnro/ui/tab-group';
import { AppSettingsPanelComponent } from './settings-panel.component';

@Component({
  selector: 'app-location-subtabs',
  template: `
    <div>Location Subtabs</div>
    <gnro-tab-group selectedIndex="0">
      <gnro-tab label="Tab 1">
        <gnro-number-field [fieldConfig]="fieldConfig" [form]="form"> </gnro-number-field>
      </gnro-tab>
      <gnro-tab label="Tab 2"> </gnro-tab>
      <gnro-tab label="Tab 3"> </gnro-tab>
    </gnro-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroTabGroupComponent,
    GnroTabComponent,
    GnroNumberFieldComponent,
    AppSettingsPanelComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AppLocationSubtabsComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() values: Record<string, unknown> = {};

  fieldConfig: GnroNumberFieldConfig = {
    ...defaultNumberFieldConfig,
    fieldName: 'area',
    fieldLabel: 'Area',
    labelWidth: 100,
    clearValue: true,
    editable: true,
  };

  ngOnInit(): void {
    const fieldName = this.fieldConfig.fieldName!;
    // Get initial value from passed values or empty string
    const initialValue = this.values[fieldName] ?? null;
    this.form.addControl(fieldName, new FormControl<number>({ value: initialValue as number, disabled: false }, []));
  }
}
