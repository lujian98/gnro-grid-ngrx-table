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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
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
export class AppFormComponent {
  items: GnroAccordion[] = [
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
        { name: 'Url Content Save File', link: 'url-content-save-file' },
      ],
    },
  ];
}
