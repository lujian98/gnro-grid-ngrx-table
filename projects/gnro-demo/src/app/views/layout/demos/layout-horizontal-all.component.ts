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
  selector: 'app-layout-horizontal-all',
  template: `
    <icc-layout>
      <icc-layout-header>Header</icc-layout-header>
      <icc-layout-horizontal [resizeable]="true">
        <icc-layout-left> </icc-layout-left>

        <icc-layout-center> Horizontal Layout With header and footer panels </icc-layout-center>

        <icc-layout-right> </icc-layout-right>
      </icc-layout-horizontal>
      <icc-layout-footer> Footer </icc-layout-footer>
    </icc-layout>
  `,
  styles: [':host { display: flex; width: 100%; }'],
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
export class AppLayoutHorizontalAllComponent {}
