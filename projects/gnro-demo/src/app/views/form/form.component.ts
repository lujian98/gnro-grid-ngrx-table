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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
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
export class AppFormComponent {
  items: IccAccordion[] = [
    {
      name: 'Form Page',
      items: [
        { name: 'Simple Form', link: 'simple-form' },
        { name: 'Theme Form', link: 'theme-form' },
        { name: 'Form Page', link: 'form-page' },
        { name: 'Password Page', link: 'password-page' },
        { name: 'File Drop', link: 'file-drop' },
        { name: 'File Drop Upload', link: 'file-drop-upload' },
        { name: 'File Select Upload', link: 'file-select-upload' },
      ],
    },
  ];
}
