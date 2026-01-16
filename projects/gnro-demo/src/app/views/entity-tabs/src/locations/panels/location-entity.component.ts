import { ChangeDetectionStrategy, Component, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
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
export class AppLocationEntityComponent implements OnInit, OnDestroy {
  private entityTabsFacade = inject(EntityTabsFacade);

  tabId: string = '';
  form: FormGroup = new FormGroup({
    nodeCode: new FormControl(''),
  });
  private readonly formValues = toSignal(this.form.valueChanges);

  // Store the activeTab signal as a class property so it can be tracked properly
  private readonly activeTab = this.entityTabsFacade.getActiveTab();

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
      const tab = this.activeTab();
      if (tab) {
        this.form.patchValue(tab.values);
      }
    });
  }

  ngOnInit(): void {
    console.log('tabId', this.tabId);
  }

  ngOnDestroy(): void {}
}
