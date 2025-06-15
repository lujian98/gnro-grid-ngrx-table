import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutCenterComponent, IccLayoutHorizontalComponent, IccLayoutRightComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-horizontal-center-right',
  template: `
    <icc-layout-horizontal [resizeable]="true">
      <icc-layout-center> Horizontal Layout With Right</icc-layout-center>
      <icc-layout-right> </icc-layout-right>
    </icc-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutRightComponent, IccLayoutHorizontalComponent, IccLayoutCenterComponent],
})
export class AppHorizontalCenterRightComponent {}
