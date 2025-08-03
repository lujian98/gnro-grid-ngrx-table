import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutFooterComponent, GnroLayoutHorizontalComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';

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

  export(): void {
    this.dialogRef.close(this.params);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
