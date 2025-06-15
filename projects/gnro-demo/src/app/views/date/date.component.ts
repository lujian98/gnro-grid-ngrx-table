import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GnroAccordion, GnroAccordionComponent } from '@gnro/ui/accordion';
import {
  GnroLayoutRightComponent,
  GnroLayoutHorizontalComponent,
  GnroLayoutLeftComponent,
  GnroLayoutCenterComponent,
} from '@gnro/ui/layout';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutCenterComponent,
    GnroLayoutRightComponent,
    GnroAccordionComponent,
  ],
})
export class AppDateComponent {
  items: GnroAccordion[] = [
    {
      name: 'Date Demos',
      items: [{ name: 'Simple Date', link: 'simple-date' }],
    },
  ];
}
