import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GnroLayoutCenterComponent,
  GnroLayoutComponent,
  GnroLayoutFooterComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutHorizontalComponent,
  GnroLayoutLeftComponent,
  GnroLayoutRightComponent,
} from '@gnro/ui/layout';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, GnroWindowConfig, defaultWindowConfig } from '@gnro/ui/window';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroLayoutFooterComponent,
    GnroLayoutCenterComponent,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutRightComponent,
    GnroButtonComponent,
    GnroWindowComponent,
  ],
})
export class AppDialogTestDemoComponent {
  private dialogRef = inject(GnroDialogRef<AppDialogTestDemoComponent>);

  windowConfig: GnroWindowConfig = {
    ...defaultWindowConfig,
    title: 'Window',
    height: '600px',
    width: '800px',
    //resizeable: false,
    //dragDisabled: true,
  };

  dialog: any;

  close(): void {
    this.dialogRef.close('test uujj make');
  }
}
