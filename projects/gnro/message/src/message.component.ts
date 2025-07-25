import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroLayoutComponent, GnroLayoutFooterComponent, GnroLayoutHorizontalComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { TranslatePipe } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { defaultMessageConfig, GnroMessageConfig } from './models/message.model';
import { GnroWindowComponent } from '@gnro/ui/window';

@Component({
  selector: 'gnro-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
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
export class GnroMessageComponent<T> {
  private dialogRef = inject(GnroDialogRef<GnroMessageComponent<T>>);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _messageConfig: GnroMessageConfig = defaultMessageConfig;
  data!: T;

  set messageConfig(val: GnroMessageConfig) {
    this._messageConfig = { ...defaultMessageConfig, ...val };
    this.changeDetectorRef.markForCheck();
    if (this.messageConfig.autoClose) {
      this.autoCloseWindow();
    }
  }
  get messageConfig(): GnroMessageConfig {
    return this._messageConfig;
  }

  ok(): void {
    this.dialogRef.close(this.data!);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  private autoCloseWindow(): void {
    timer(this.messageConfig.duration)
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
