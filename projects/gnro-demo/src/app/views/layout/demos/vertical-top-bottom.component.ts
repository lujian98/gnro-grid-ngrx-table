import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutTopComponent, GnroLayoutVerticalComponent, GnroLayoutBottomComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-vertical-top-bottom',
  template: `
    <gnro-layout-vertical [resizeable]="true">
      <gnro-layout-top> Vertical Layout (Top, Bottom) </gnro-layout-top>
      <gnro-layout-bottom> </gnro-layout-bottom>
    </gnro-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutTopComponent, GnroLayoutVerticalComponent, GnroLayoutBottomComponent],
})
export class AppVerticalTopBottomComponent {}
