import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, output } from '@angular/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroLayoutComponent } from '@gnro/ui/layout';
import { GnroFormStateModule } from './+state/form-state.module';
import { GnroFormFacade } from './+state/form.facade';
import { GnroFormViewComponent } from './components/form-view.component';
import { defaultFormConfig } from './models/default-form';
import { GnroFormButtonClick, GnroFormConfig } from './models/form.model';

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
  private formId = `form-${crypto.randomUUID()}`;
  formConfig$ = this.formFacade.getFormConfig(this.formId);
  formSetting$ = this.formFacade.getSetting(this.formId);
  formFieldsConfig$ = this.formFacade.getFormFieldsConfig(this.formId);
  formData$ = this.formFacade.getFormSignalData(this.formId);
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
        this.formFacade.setFormFieldsConfig(this.formId, this.formConfig$(), formFields);
      }
      return formFields;
    },
  });
  values = input(undefined, {
    transform: (values: object) => {
      console.log(' xxx set form data=', values);
      this.formFacade.setFormData(this.formId, this.formConfig(), values);
      return values;
    },
  });
  gnroFormButtonClick = output<GnroFormButtonClick>();

  get autoFitHeight() {
    return this.formConfig().autoFitHeight;
  }

  constructor() {
    this.initFormConfig({ ...defaultFormConfig });
  }

  private initFormConfig(formConfig: GnroFormConfig): void {
    this.formFacade.initFormConfig(this.formId, formConfig);
  }

  formButtonClick(buttonClick: GnroFormButtonClick): void {
    this.gnroFormButtonClick.emit(buttonClick);
  }

  ngOnDestroy(): void {
    this.formFacade.clearformDataStore(this.formId);
  }
}
