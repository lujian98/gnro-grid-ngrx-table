import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GnroAccordion, GnroAccordionComponent } from '@gnro/ui/accordion';
import { GnroLayoutHorizontalComponent, GnroLayoutLeftComponent, GnroLayoutCenterComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutCenterComponent,
    GnroAccordionComponent,
  ],
})
export class AppDashboardComponent {
  items: GnroAccordion[] = [
    {
      name: 'Dashboard Demo',
      items: [{ name: 'Dashboard Demo', link: 'dashboard-demo' }],
    },
  ];
}
