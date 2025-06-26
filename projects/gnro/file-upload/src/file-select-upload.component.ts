import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { GnroCheckboxComponent } from '@gnro/ui/checkbox';
import { GnroButtonConfg, GnroBUTTONS, GnroButtonType, GnroObjectType } from '@gnro/ui/core';
import { GnroUploadFileFieldComponent, GnroUploadFileFieldConfig } from '@gnro/ui/fields';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GnroFileUploadStateModule } from './+state/file-upload-state.module';
import { GnroFileUploadFacade } from './+state/file-upload.facade';
import { GnroFileUploadGridComponent } from './components/file-upload-grid/file-upload-grid.component';
import { defaultFileUploadConfig, GnroFileUploadConfig } from './models/file-upload.model';

@Component({
  selector: 'gnro-file-select-upload',
  templateUrl: './file-select-upload.component.html',
  styleUrls: ['./file-select-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    GnroFileUploadStateModule,
    GnroIconModule,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroFileUploadGridComponent,
    GnroCheckboxComponent,
    GnroUploadFileFieldComponent,
  ],
})
export class GnroFileSelectUploadComponent implements OnDestroy {
  private readonly fileUploadFacade = inject(GnroFileUploadFacade);
  private readonly translateService = inject(TranslateService);
  private buttons: GnroButtonConfg[] = [GnroBUTTONS.UploadFile, GnroBUTTONS.Reset];
  uploadFiles$ = this.fileUploadFacade.getUploadFiles$;
  enabled = signal<boolean>(true);
  fileUploadConfig = input(defaultFileUploadConfig, {
    transform: (val: Partial<GnroFileUploadConfig>) => ({ ...defaultFileUploadConfig, ...val }),
  });

  fieldConfigs = computed(() => {
    const fieldConfigs = [];
    if (this.fileUploadConfig().maxSelectUploads) {
      const fileI18n = this.translateService.instant('GNRO.UI.FILE.FILE');
      for (let i = 0; i < this.fileUploadConfig().maxSelectUploads; i++) {
        fieldConfigs.push({
          fieldType: GnroObjectType.UploadFile,
          labelWidth: 60,
          fieldName: `file_select_upload_${i + 1}`,
          fieldLabel: `${fileI18n} ${i + 1}`,
          editable: this.enabled(),
          clearValue: true,
        });
      }
    }
    return fieldConfigs;
  });

  buttons$ = computed(() => {
    const disabled = this.uploadFiles$().length === 0 ? true : false;
    return [...this.buttons].map((button) => {
      return {
        ...button,
        disabled: disabled,
      };
    });
  });

  @ViewChildren(GnroUploadFileFieldComponent) private uploadFileFields!: QueryList<GnroUploadFileFieldComponent>;

  selectUploadFile(fieldConfig: GnroUploadFileFieldConfig, file: File | null): void {
    this.fileUploadFacade.selectedUploadFile(fieldConfig.fieldName!, file);
  }

  onChange(enabled: boolean): void {
    if (typeof enabled === 'boolean') {
      this.enabled.set(enabled);
    }
  }

  private clearUploadFileFields(): void {
    this.uploadFileFields?.toArray().forEach((field) => field.clearValue());
  }

  buttonClick(button: GnroButtonConfg): void {
    switch (button.name) {
      case GnroButtonType.Reset:
        this.fileUploadFacade.clearUploadFiles();
        this.clearUploadFileFields();
        break;
      case GnroButtonType.UploadFile:
        this.fileUploadFacade.uploadFiles(this.fileUploadConfig());
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.fileUploadFacade.clearUploadFiles();
  }
}
