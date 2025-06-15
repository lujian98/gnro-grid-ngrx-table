import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IccAccordion, IccAccordionComponent } from '@icc/ui/accordion';
import {
  IccLayoutRightComponent,
  IccLayoutHorizontalComponent,
  IccLayoutLeftComponent,
  IccLayoutCenterComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
    IccLayoutRightComponent,
    IccAccordionComponent,
  ],
})
export class AppLayoutComponent {
  items: IccAccordion[] = [
    {
      name: 'Layout Demo',
      expanded: true,
      items: [
        { name: 'Horizontal Layout (Left, Center, Right)', link: 'horizontal-layout' },
        { name: 'Horizontal Layout (Left, Center)', link: 'horizontal-left-center' },
        { name: 'Horizontal Layout (Center, Right)', link: 'horizontal-center-right' },
        { name: 'Horizontal Layout (Left, Right)', link: 'horizontal-left-right' },
        { name: 'Horizontal Layout (header and footer)', link: 'layout-horizontal-all' },

        { name: 'Vertical Layout (Top, Middle, Bottom)', link: 'layout-vertical' },
        { name: 'Vertical Layout (Top, Middle)', link: 'vertical-top-middle' },
        { name: 'Vertical Layout (Middle, Bottom)', link: 'vertical-middle-bottom' },
        { name: 'Vertical Layout (Top, Bottom)', link: 'vertical-top-bottom' },
        { name: 'Vertical Layout (header and footer)', link: 'layout-vertical-all' },

        { name: 'Horizontal & Vertical Layout (mixed)', link: 'layout-horizontal-vertical' },

        { name: 'Main Layout resizeable', link: 'layout-resizeable' },
        { name: 'Accordion Layout', link: 'accordion-layout' },
      ],
    },
  ];
}
