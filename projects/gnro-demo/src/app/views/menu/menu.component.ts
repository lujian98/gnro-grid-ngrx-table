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
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
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
export class AppMenuComponent {
  items: GnroAccordion[] = [
    {
      name: 'Menu Demo',
      items: [
        { name: 'Simple Menu', link: 'simple-menu' },
        { name: 'Menu Panel', link: 'menu-panel' },
      ],
    },
  ];
}
