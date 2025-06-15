import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IccLayoutComponent,
  IccLayoutHeaderComponent,
  IccLayoutFooterComponent,
  IccLayoutCenterComponent,
  IccLayoutHorizontalComponent,
  IccLayoutLeftComponent,
  IccLayoutRightComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-layout-resizeable',
  template: `
    <icc-layout [resizeable]="true" height="500px" width="600px" style="padding: 2px">
      <icc-layout-header>Header</icc-layout-header>

      <icc-layout-horizontal [resizeable]="true">
        <icc-layout-left> </icc-layout-left>

        <icc-layout-center> Horizontal Layout With header and footer panels </icc-layout-center>

        <icc-layout-right> </icc-layout-right>
      </icc-layout-horizontal>

      <icc-layout-footer> Footer </icc-layout-footer>
    </icc-layout>
  `,
  styles: [':host { display: flex; width: 100%; padding: 5px; icc-layout-footer { border: 1px solid green } }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IccLayoutComponent,
    IccLayoutHeaderComponent,
    IccLayoutFooterComponent,
    IccLayoutRightComponent,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
  ],
})
export class AppLayoutResizeableComponent {}
