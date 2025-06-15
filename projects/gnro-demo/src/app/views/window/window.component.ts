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
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
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
export class AppWindowComponent {
  items: IccAccordion[] = [
    {
      name: 'Window & Dialog',
      items: [
        { name: 'Simple Window', link: 'simple-window' },
        { name: 'Confirmation', link: 'confirmation' },
      ],
    },
  ];
}
