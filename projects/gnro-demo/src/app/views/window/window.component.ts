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
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
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
export class AppWindowComponent {
  items: GnroAccordion[] = [
    {
      name: 'Window & Dialog',
      items: [
        { name: 'Simple Window', link: 'simple-window' },
        { name: 'Message', link: 'message' },
      ],
    },
  ];
}
