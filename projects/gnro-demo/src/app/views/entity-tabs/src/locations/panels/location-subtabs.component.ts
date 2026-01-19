import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroNumberFieldComponent, GnroNumberFieldConfig, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroTabComponent, GnroTabGroupComponent } from '@gnro/ui/tab-group';
import { AppSettingsPanelComponent } from './settings-panel.component';
import { AppDimensionsPanelComponent } from './dimensions-panel.component';
import { EntityTabsFacade } from '../../libs/entity-tabs/+state/entity-tabs.facade';

@Component({
  selector: 'app-location-subtabs',
  template: `
    <div>Location Subtabs</div>
    <gnro-tab-group [selectedIndex]="activeTab$()!.subtabIndex!" (selectedIndexChange)="onSelectedIndexChange($event)">
      <gnro-tab label="Tab 1">
        <div>Subtabs Panel</div>
        <gnro-number-field [fieldConfig]="fieldConfig" [form]="form"> </gnro-number-field>
      </gnro-tab>
      <gnro-tab label="Tab 2">
        <app-settings-panel [form]="form" [values]="values"></app-settings-panel>
      </gnro-tab>
      <gnro-tab label="Tab 3">
        <app-dimensions-panel [form]="form" [values]="values"></app-dimensions-panel>
      </gnro-tab>
    </gnro-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroTabGroupComponent,
    GnroTabComponent,
    GnroNumberFieldComponent,
    AppSettingsPanelComponent,
    AppDimensionsPanelComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AppLocationSubtabsComponent implements OnInit {
  private entityTabsFacade = inject(EntityTabsFacade);
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

  activeTab$ = this.entityTabsFacade.getActiveTab();

  ngOnInit(): void {
    const fieldName = this.fieldConfig.fieldName!;
    // Get initial value from passed values or empty string
    const initialValue = this.values[fieldName] ?? null;
    this.form.addControl(fieldName, new FormControl<number>({ value: initialValue as number, disabled: false }, []));
  }

  onSelectedIndexChange(index: number): void {
    const tab = this.activeTab$();
    if (tab) {
      const updatedValues = { ...tab.values, subtabIndex: index };
      this.entityTabsFacade.updateTabValues(tab.id, updatedValues);
    }
  }
}
