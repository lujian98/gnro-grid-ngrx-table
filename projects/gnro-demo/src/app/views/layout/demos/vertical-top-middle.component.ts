import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutTopComponent, IccLayoutVerticalComponent, IccLayoutMiddleComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-vertical-top-middle',
  template: `
    <icc-layout-vertical [resizeable]="true">
      <icc-layout-top> </icc-layout-top>
      <icc-layout-middle> Vertical Layout (Top, Middle) </icc-layout-middle>
    </icc-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutTopComponent, IccLayoutVerticalComponent, IccLayoutMiddleComponent],
})
export class AppVerticalTopMiddleComponent {}
