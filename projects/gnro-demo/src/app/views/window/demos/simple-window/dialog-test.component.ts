import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IccLayoutCenterComponent,
  IccLayoutComponent,
  IccLayoutFooterComponent,
  IccLayoutHeaderComponent,
  IccLayoutHorizontalComponent,
  IccLayoutLeftComponent,
  IccLayoutRightComponent,
} from '@icc/ui/layout';
import { IccButtonComponent } from '@icc/ui/button';
import { IccDialogRef } from '@icc/ui/overlay';
import { IccWindowComponent, IccWindowConfig, defaultWindowConfig } from '@icc/ui/window';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IccLayoutComponent,
    IccLayoutHeaderComponent,
    IccLayoutFooterComponent,
    IccLayoutCenterComponent,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutRightComponent,
    IccButtonComponent,
    IccWindowComponent,
  ],
})
export class AppDialogTestDemoComponent {
  private dialogRef = inject(IccDialogRef<AppDialogTestDemoComponent>);

  windowConfig: IccWindowConfig = {
    ...defaultWindowConfig,
    title: 'Window',
    height: '600px',
    //resizeable: false,
    //dragDisabled: true,
  };

  dialog: any;

  close(): void {
    this.dialogRef.close('test uujj make');
  }
}
