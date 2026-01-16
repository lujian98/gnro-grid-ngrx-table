import { ChangeDetectionStrategy, Component, inject, OnInit, effect } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { EntityTabsFacade } from '../../libs/entity-tabs/+state/entity-tabs.facade';

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
  private entityTabsFacade = inject(EntityTabsFacade);
  tabId: string = '';
  form: FormGroup = new FormGroup({
    nodeCode: new FormControl(''),
  });

  fieldConfig: GnroTextFieldConfig = {
    ...defaultTextFieldConfig,
    fieldName: 'nodeCode',
    fieldLabel: 'Name',
    labelWidth: 120,
    clearValue: true,
    editable: true,
  };

  constructor() {
    effect(() => {
      const tab = this.entityTabsFacade.getActiveTab();
      console.log('pppppptab', tab());
      this.form.patchValue(tab()!.values);
    });
  }

  ngOnInit(): void {
    console.log('tabId', this.tabId);
  }
}
