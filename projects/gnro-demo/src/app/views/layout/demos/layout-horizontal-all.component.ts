import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutFooterComponent,
  GnroLayoutCenterComponent,
  GnroLayoutHorizontalComponent,
  GnroLayoutLeftComponent,
  GnroLayoutRightComponent,
} from '@gnro/ui/layout';

@Component({
  selector: 'app-layout-horizontal-all',
  template: `
    <gnro-layout>
      <gnro-layout-header>Header</gnro-layout-header>
      <gnro-layout-horizontal [resizeable]="true">
        <gnro-layout-left> </gnro-layout-left>

        <gnro-layout-center> Horizontal Layout With header and footer panels </gnro-layout-center>

        <gnro-layout-right> </gnro-layout-right>
      </gnro-layout-horizontal>
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
    GnroLayoutRightComponent,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutCenterComponent,
  ],
})
export class AppLayoutHorizontalAllComponent {}
