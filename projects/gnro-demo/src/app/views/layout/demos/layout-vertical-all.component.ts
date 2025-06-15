import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutFooterComponent,
  GnroLayoutTopComponent,
  GnroLayoutVerticalComponent,
  GnroLayoutMiddleComponent,
  GnroLayoutBottomComponent,
} from '@gnro/ui/layout';

@Component({
  selector: 'app-layout-vertical-all',
  template: `
    <gnro-layout>
      <gnro-layout-header>Header</gnro-layout-header>

      <gnro-layout-vertical [resizeable]="true">
        <gnro-layout-top> </gnro-layout-top>
        <gnro-layout-middle> Vertical Layout (Header and Footer) </gnro-layout-middle>
        <gnro-layout-bottom> </gnro-layout-bottom>
      </gnro-layout-vertical>

      <gnro-layout-footer> Footer </gnro-layout-footer>
    </gnro-layout>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroLayoutFooterComponent,
    GnroLayoutTopComponent,
    GnroLayoutVerticalComponent,
    GnroLayoutMiddleComponent,
    GnroLayoutBottomComponent,
  ],
})
export class AppLayoutVerticalAllComponent {}
