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
  IccLayoutTopComponent,
  IccLayoutVerticalComponent,
  IccLayoutMiddleComponent,
  IccLayoutBottomComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-layout-horizontal-vertical',
  template: `
    <icc-layout>
      <icc-layout-header>Header</icc-layout-header>
      <icc-layout-horizontal [resizeable]="true">
        <icc-layout-left> </icc-layout-left>

        <icc-layout-center>
          <icc-layout>
            <icc-layout-header>Header</icc-layout-header>

            <icc-layout-vertical [resizeable]="true">
              <icc-layout-top> </icc-layout-top>
              <icc-layout-middle> Vertical Layout (Header and Footer) </icc-layout-middle>
              <icc-layout-bottom> </icc-layout-bottom>
            </icc-layout-vertical>

            <icc-layout-footer> Footer </icc-layout-footer>
          </icc-layout>
        </icc-layout-center>

        <icc-layout-right> </icc-layout-right>
      </icc-layout-horizontal>
      <icc-layout-footer> Footer </icc-layout-footer>
    </icc-layout>
  `,
  styles: [':host { display: flex; width: 100%;  }'],
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
    IccLayoutTopComponent,
    IccLayoutVerticalComponent,
    IccLayoutMiddleComponent,
    IccLayoutBottomComponent,
  ],
})
export class AppLayoutHorizontalVerticalComponent {}
