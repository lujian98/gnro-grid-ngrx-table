import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IccAccordion, IccAccordionComponent } from '@icc/ui/accordion';
import { IccLayoutHorizontalComponent, IccLayoutLeftComponent, IccLayoutCenterComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
    IccAccordionComponent,
  ],
})
export class AppDashboardComponent {
  items: IccAccordion[] = [
    {
      name: 'Dashboard Demo',
      items: [{ name: 'Dashboard Demo', link: 'dashboard-demo' }],
    },
  ];
}
