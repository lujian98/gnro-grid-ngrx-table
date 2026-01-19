import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, output, Signal } from '@angular/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroLayoutComponent } from '@gnro/ui/layout';
import { GnroDataType } from '@gnro/ui/core';
import { GnroFormStateModule } from './+state/form-state.module';
import { GnroFormFacade } from './+state/form.facade';
import { GnroFormViewComponent } from './components/form-view.component';
import { defaultFormConfig } from './models/default-form';
import { GnroFormButtonClick, GnroFormConfig, GnroFormSetting } from './models/form.model';

@Component({
  selector: 'gnro-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.auto-fit-height]': 'formConfig.autoFitHeight',
  },
  imports: [GnroFormStateModule, GnroFormViewComponent, GnroLayoutComponent],
})
export class GnroFormComponent implements OnDestroy {
  private readonly formFacade = inject(GnroFormFacade);

  formConfig = input(defaultFormConfig, {
    transform: (value: Partial<GnroFormConfig>) => {
      const formConfig = { ...defaultFormConfig, ...value };
      this.initFormConfig(formConfig);
      return formConfig;
    },
  });
  formFields = input([], {
    transform: (formFields: GnroFormField[]) => {
      if (!this.formConfig$().remoteFieldsConfig && formFields.length > 0) {
        this.formFacade.setFieldsConfig(this.formConfig().formName, this.formConfig$(), formFields);
      }
      return formFields;
    },
  });
  values = input(undefined, {
    transform: (values: GnroDataType) => {
      this.formFacade.setData(this.formConfig().formName, this.formConfig(), values);
      return values;
    },
  });

  // Computed signals for reactive data binding
  formConfig$: Signal<GnroFormConfig> = computed(() => this.formFacade.getConfig(this.formConfig().formName)());
  formSetting$: Signal<GnroFormSetting> = computed(() => this.formFacade.getSetting(this.formConfig().formName)());
  formFieldsConfig$: Signal<GnroFormField[]> = computed(() =>
    this.formFacade.getFieldsConfig(this.formConfig().formName)(),
  );
  formData$: Signal<GnroDataType | undefined> = computed(() =>
    this.formFacade.getSignalData(this.formConfig().formName)(),
  );

  gnroFormButtonClick = output<GnroFormButtonClick>();

  get autoFitHeight() {
    return this.formConfig().autoFitHeight;
  }

  private initFormConfig(formConfig: GnroFormConfig): void {
    this.formFacade.initConfig(formConfig.formName, formConfig);
  }

  formButtonClick(buttonClick: GnroFormButtonClick): void {
    this.gnroFormButtonClick.emit(buttonClick);
  }

  ngOnDestroy(): void {
    this.formFacade.clearStore(this.formConfig().formName);
  }
}
