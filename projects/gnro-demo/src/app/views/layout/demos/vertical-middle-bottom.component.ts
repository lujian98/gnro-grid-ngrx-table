import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutVerticalComponent, GnroLayoutMiddleComponent, GnroLayoutBottomComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-vertical-middle-bottom',
  template: `
    <gnro-layout-vertical [resizeable]="true">
      <gnro-layout-middle> Vertical Layout (Top, Middle, Bottom) </gnro-layout-middle>
      <gnro-layout-bottom> </gnro-layout-bottom>
    </gnro-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutVerticalComponent, GnroLayoutMiddleComponent, GnroLayoutBottomComponent],
})
export class AppVerticalMiddleBottomComponent {}
