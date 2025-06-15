import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutCenterComponent, GnroLayoutHorizontalComponent, GnroLayoutLeftComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-horizontal-left-center',
  template: `
    <gnro-layout-horizontal [resizeable]="true">
      <gnro-layout-left> </gnro-layout-left>
      <gnro-layout-center> Horizontal Layout With Left</gnro-layout-center>
    </gnro-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutHorizontalComponent, GnroLayoutLeftComponent, GnroLayoutCenterComponent],
})
export class AppHorizontalLeftCenterComponent {}
