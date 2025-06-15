import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IccLayoutTopComponent,
  IccLayoutVerticalComponent,
  IccLayoutMiddleComponent,
  IccLayoutBottomComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-layout-vertical',
  template: `
    <icc-layout-vertical [resizeable]="true">
      <icc-layout-top> </icc-layout-top>
      <icc-layout-middle> Vertical Layout (Top, Middle, Bottom) </icc-layout-middle>
      <icc-layout-bottom> </icc-layout-bottom>
    </icc-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IccLayoutTopComponent,
    IccLayoutVerticalComponent,
    IccLayoutMiddleComponent,
    IccLayoutBottomComponent,
  ],
})
export class AppLayoutVerticalComponent {}
