import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccLayoutVerticalComponent, IccLayoutMiddleComponent, IccLayoutBottomComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-vertical-middle-bottom',
  template: `
    <icc-layout-vertical [resizeable]="true">
      <icc-layout-middle> Vertical Layout (Top, Middle, Bottom) </icc-layout-middle>
      <icc-layout-bottom> </icc-layout-bottom>
    </icc-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutVerticalComponent, IccLayoutMiddleComponent, IccLayoutBottomComponent],
})
export class AppVerticalMiddleBottomComponent {}
