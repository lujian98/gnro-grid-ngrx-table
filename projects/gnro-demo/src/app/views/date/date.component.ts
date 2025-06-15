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
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
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
export class AppDateComponent {
  items: IccAccordion[] = [
    {
      name: 'Date Demos',
      items: [{ name: 'Simple Date', link: 'simple-date' }],
    },
  ];
}
