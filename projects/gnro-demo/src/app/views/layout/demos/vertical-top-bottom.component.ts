import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutTopComponent, IccLayoutVerticalComponent, IccLayoutBottomComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-vertical-top-bottom',
  template: `
    <icc-layout-vertical [resizeable]="true">
      <icc-layout-top> Vertical Layout (Top, Bottom) </icc-layout-top>
      <icc-layout-bottom> </icc-layout-bottom>
    </icc-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutTopComponent, IccLayoutVerticalComponent, IccLayoutBottomComponent],
})
export class AppVerticalTopBottomComponent {}
