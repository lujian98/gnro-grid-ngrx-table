import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroLayoutTopComponent, GnroLayoutVerticalComponent, GnroLayoutMiddleComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-vertical-top-middle',
  template: `
    <gnro-layout-vertical [resizeable]="true">
      <gnro-layout-top> </gnro-layout-top>
      <gnro-layout-middle> Vertical Layout (Top, Middle) </gnro-layout-middle>
    </gnro-layout-vertical>
  `,
  styles: [':host { display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroLayoutTopComponent, GnroLayoutVerticalComponent, GnroLayoutMiddleComponent],
})
export class AppVerticalTopMiddleComponent {}
