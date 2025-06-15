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
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
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
export class AppTreeComponent {
  items: IccAccordion[] = [
    {
      name: 'Tree Grid Demo',
      items: [
        { name: '1: Default Tree Grid', link: 'app-default-tree' },
        { name: '2: Tree Remote Data (only)', link: 'app-tree-remote-data' },
        { name: '3: Tree Remote Column & Data', link: 'app-tree-remote-conlumn-data' },
        { name: '4: Tree Remote All', link: 'app-tree-remote-all' },
        { name: '5: Tree Remote Config & Data', link: 'app-tree-remote-config-data' },
        { name: '6: Tree Remote Config & Column', link: 'app-tree-remote-config-column' },
        { name: '7: Tree Remote Config (only)', link: 'app-tree-remote-config' },
        { name: '8: Tree Remote Column (only)', link: 'app-tree-remote-column' },
      ],
    },
  ];
}
