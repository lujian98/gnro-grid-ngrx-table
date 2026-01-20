import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GnroTextFieldComponent, defaultTextFieldConfig } from '@gnro/ui/fields';
import { GnroLayoutComponent } from '@gnro/ui/layout';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EntityTabsFacade } from '../../libs/entity-tabs/+state/entity-tabs.facade';
import { AppIdentityPanelComponent } from './identity-panel.component';
import { AppAddressPanelComponent } from './address-panel.component';
import { AppLocationSubtabsComponent } from './location-subtabs.component';

@Component({
  selector: 'app-location-entity',
  templateUrl: './location-entity.component.html',
  styleUrls: ['./location-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GnroLayoutComponent,
    FormsModule,
    GnroTextFieldComponent,
    AppIdentityPanelComponent,
    AppAddressPanelComponent,
    AppLocationSubtabsComponent,
  ],
})
export class AppLocationEntityComponent {
  private entityTabsFacade = inject(EntityTabsFacade);
  private destroyRef = inject(DestroyRef);

  tabId = input.required<string>();

  form: FormGroup = new FormGroup({
    nodeCode: new FormControl('', Validators.required),
  });

  // Flag to prevent syncing to store when loading from store
  private isLoadingFromStore = false;

  // Store the activeTab signal as a class property so it can be tracked properly
  private readonly activeTab = this.entityTabsFacade.getActiveTab();

  // Expose values for child components
  readonly tabValues = computed(() => (this.activeTab()?.values ?? {}) as Record<string, unknown>);

  fieldConfig = computed(() => {
    return {
      ...defaultTextFieldConfig,
      fieldName: 'nodeCode',
      fieldLabel: 'Name',
      labelWidth: 100,
      clearValue: true,
      editable: this.activeTab()?.editing ?? false,
    };
  });

  constructor() {
    // Load values from store when active tab changes
    effect(() => {
      const tab = this.activeTab();
      if (tab) {
        this.isLoadingFromStore = true;
        this.form.patchValue(tab.values, { emitEvent: false });
        this.isLoadingFromStore = false;
      }
    });

    // Sync form changes back to store
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((values) => {
        if (!this.isLoadingFromStore) {
          const tab = this.activeTab();
          if (tab) {
            // Merge form values with existing tab values
            const updatedValues = { ...tab.values, ...values };
            this.entityTabsFacade.updateTabValues(tab.id, updatedValues);
            const invalid = this.form.invalid;
            console.log('tab=', tab);
            console.log('invalid=', invalid);
            this.entityTabsFacade.setTabInvalid(tab.id, invalid);
          }
        }
      });
  }
}
