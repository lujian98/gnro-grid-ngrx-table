import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutCenterComponent, IccLayoutHorizontalComponent, IccLayoutLeftComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-horizontal-left-center',
  template: `
    <icc-layout-horizontal [resizeable]="true">
      <icc-layout-left> </icc-layout-left>
      <icc-layout-center> Horizontal Layout With Left</icc-layout-center>
    </icc-layout-horizontal>
  `,
  styles: [':host { display: flex; width: 100%; flex-direction: column;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutHorizontalComponent, IccLayoutLeftComponent, IccLayoutCenterComponent],
})
export class AppHorizontalLeftCenterComponent {}
