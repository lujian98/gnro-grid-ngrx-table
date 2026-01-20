import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';
import { EntityTabsFacade } from '../../libs/entity-tabs/+state/entity-tabs.facade';

@Component({
  selector: 'app-dimensions-panel',
  template: `
    <div>Dimensions Panel</div>
    <gnro-text-field [fieldConfig]="fieldConfig()" [form]="form"> </gnro-text-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTextFieldComponent, FormsModule, ReactiveFormsModule],
})
export class AppDimensionsPanelComponent implements OnInit {
  private entityTabsFacade = inject(EntityTabsFacade);
  private readonly activeTab = this.entityTabsFacade.getActiveTab();
  @Input({ required: true }) form!: FormGroup;
  @Input() values: Record<string, unknown> = {};

  fieldConfig = computed(() => {
    return {
      ...defaultTextFieldConfig,
      fieldName: 'ownerName',
      fieldLabel: 'Owner Name',
      labelWidth: 100,
      clearValue: true,
      editable: this.activeTab()?.editing ?? false,
    };
  });

  ngOnInit(): void {
    const fieldName = this.fieldConfig().fieldName!;
    // Get initial value from passed values or empty string
    const initialValue = this.values[fieldName] ?? '';
    this.form.addControl(fieldName, new FormControl<string>({ value: initialValue as string, disabled: false }, []));
  }
}
