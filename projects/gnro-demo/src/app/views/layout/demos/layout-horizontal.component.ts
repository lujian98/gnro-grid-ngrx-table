import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GnroLayoutCenterComponent,
  GnroLayoutHorizontalComponent,
  GnroLayoutLeftComponent,
  GnroLayoutRightComponent,
} from '@gnro/ui/layout';

@Component({
  selector: 'app-layout-horizontal',
  template: `
    <gnro-layout-horizontal [resizeable]="true">
      <gnro-layout-left> </gnro-layout-left>

      <gnro-layout-center> Horizontal Layout With Left and Right panels </gnro-layout-center>

      <gnro-layout-right> </gnro-layout-right>
    </gnro-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroLayoutRightComponent,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutCenterComponent,
  ],
})
export class AppLayoutHorizontalComponent {}
