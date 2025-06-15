import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IccLayoutCenterComponent,
  IccLayoutHorizontalComponent,
  IccLayoutLeftComponent,
  IccLayoutRightComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-layout-horizontal',
  template: `
    <icc-layout-horizontal [resizeable]="true">
      <icc-layout-left> </icc-layout-left>

      <icc-layout-center> Horizontal Layout With Left and Right panels </icc-layout-center>

      <icc-layout-right> </icc-layout-right>
    </icc-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IccLayoutRightComponent,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
  ],
})
export class AppLayoutHorizontalComponent {}
