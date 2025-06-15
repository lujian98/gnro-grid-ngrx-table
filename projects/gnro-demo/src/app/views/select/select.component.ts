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
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
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
export class AppSelectComponent {
  items: GnroAccordion[] = [
    {
      name: 'Select Demo',
      items: [
        { name: 'Simple Select', link: 'simple-select' },
        { name: 'String Array Select', link: 'string-array' },
      ],
    },
  ];
}
