import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutFooterComponent, GnroLayoutHorizontalComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { TranslatePipe } from '@ngx-translate/core';
import { defaultConfirmationConfig, GnroConfirmationConfig } from '../../models/confirmation.model';
import { GnroWindowComponent } from '../../window.component';

@Component({
  selector: 'gnro-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
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
export class GnroConfirmationComponent {
  private dialogRef = inject(GnroDialogRef<GnroConfirmationComponent>);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _confirmationConfig: GnroConfirmationConfig = defaultConfirmationConfig;

  set confirmationConfig(val: GnroConfirmationConfig) {
    this._confirmationConfig = { ...defaultConfirmationConfig, ...val };
    this.changeDetectorRef.markForCheck();
  }
  get confirmationConfig(): GnroConfirmationConfig {
    return this._confirmationConfig;
  }

  ok(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  close(): void {
    this.dialogRef.close();
  }
}
