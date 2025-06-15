import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutHorizontalComponent, IccLayoutLeftComponent, IccLayoutRightComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-horizontal-left-right',
  template: `
    <icc-layout-horizontal [resizeable]="true">
      <icc-layout-left> Horizontal Layout Left and Right </icc-layout-left>
      <icc-layout-right> </icc-layout-right>
    </icc-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutRightComponent, IccLayoutHorizontalComponent, IccLayoutLeftComponent],
})
export class AppHorizontalLeftRightComponent {}
