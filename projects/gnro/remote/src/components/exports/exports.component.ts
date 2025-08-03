import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutFooterComponent, GnroLayoutHorizontalComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroSelectFieldComponent } from '@gnro/ui/fields';

@Component({
  selector: 'gnro-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    GnroLayoutComponent,
    GnroLayoutFooterComponent,
    GnroLayoutHorizontalComponent,
    GnroButtonComponent,
    GnroSelectFieldComponent,
    GnroWindowComponent,
  ],
})
export class GnroExportsComponent {
  private dialogRef = inject(GnroDialogRef<GnroExportsComponent>);
  params!: HttpParams;

  windowConfig = {
    ...defaultWindowConfig,
    title: 'GNRO.UI.ACTIONS.EXPORT',
    width: '400px',
  };

  selectionConfig = {
    fieldLabel: 'Export Format', // TODO i18n
    fieldName: 'ExportFormat',
    clearValue: false,
  };
  exportOptions: string[] = ['Excel', 'CSV', 'PDF'];
  exportFormat = 'Excel';
  selectExportFormat(format: string): void {
    console.log(' format=', format);
    this.exportFormat = format;
  }

  export(): void {
    const params = this.params.append('exportFormat', this.exportFormat);
    this.dialogRef.close(params);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
