import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GnroLayoutTopComponent,
  GnroLayoutVerticalComponent,
  GnroLayoutMiddleComponent,
  GnroLayoutBottomComponent,
} from '@gnro/ui/layout';

@Component({
  selector: 'app-layout-vertical',
  template: `
    <gnro-layout-vertical [resizeable]="true">
      <gnro-layout-top> </gnro-layout-top>
      <gnro-layout-middle> Vertical Layout (Top, Middle, Bottom) </gnro-layout-middle>
      <gnro-layout-bottom> </gnro-layout-bottom>
    </gnro-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroLayoutTopComponent,
    GnroLayoutVerticalComponent,
    GnroLayoutMiddleComponent,
    GnroLayoutBottomComponent,
  ],
})
export class AppLayoutVerticalComponent {}
