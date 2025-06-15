import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutHorizontalComponent, GnroLayoutLeftComponent, GnroLayoutRightComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-horizontal-left-right',
  template: `
    <gnro-layout-horizontal [resizeable]="true">
      <gnro-layout-left> Horizontal Layout Left and Right </gnro-layout-left>
      <gnro-layout-right> </gnro-layout-right>
    </gnro-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutRightComponent, GnroLayoutHorizontalComponent, GnroLayoutLeftComponent],
})
export class AppHorizontalLeftRightComponent {}
