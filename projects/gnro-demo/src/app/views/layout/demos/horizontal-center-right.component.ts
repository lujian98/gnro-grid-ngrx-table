import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutCenterComponent, GnroLayoutHorizontalComponent, GnroLayoutRightComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-horizontal-center-right',
  template: `
    <gnro-layout-horizontal [resizeable]="true">
      <gnro-layout-center> Horizontal Layout With Right</gnro-layout-center>
      <gnro-layout-right> </gnro-layout-right>
    </gnro-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutRightComponent, GnroLayoutHorizontalComponent, GnroLayoutCenterComponent],
})
export class AppHorizontalCenterRightComponent {}
