import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IccAccordion, IccAccordionComponent } from '@icc/ui/accordion';
import { IccLayoutHorizontalComponent, IccLayoutLeftComponent, IccLayoutCenterComponent } from '@icc/ui/layout';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccLayoutHorizontalComponent,
    IccLayoutLeftComponent,
    IccLayoutCenterComponent,
    IccAccordionComponent,
  ],
})
export class AppGridComponent {
  items: IccAccordion[] = [
    {
      name: 'Grid Demo',
      items: [
        { name: '0: Default Grid', link: 'app-default-grid' },
        { name: '1: Simple Grid', link: 'remote-simple-grid' },
        { name: '2: Grid Sort', link: 'remote-grid-sort' },
        { name: '3: Grid Filter', link: 'remote-grid-filter' },
        {
          name: '4: Grid Column Resize',
          link: 'remote-grid-column-resize',
        },
        {
          name: '5: Grid Column Reorder',
          link: 'remote-grid-column-reorder',
        },
        { name: '6: Grid Column Menu', link: 'remote-grid-column-menu' },
        {
          name: '7: Grid Column Hidden',
          link: 'remote-grid-column-hidden',
        },
        {
          name: '8: Grid Remote Column Config',
          link: 'remote-grid-remote-column-config',
        },
        {
          name: '9: Grid Row Seletion',
          link: 'remote-grid-row-selection',
        },
        { name: '10: Grid Page', link: 'remote-grid-page' },
        { name: '11: Grid Vertical Scroll', link: 'remote-grid-vertical-scroll' },
        {
          name: '12: Grid Horizontal Scroll',
          link: 'remote-grid-horizontal-scroll',
        },
        {
          name: '13: Grid Remote Virtual Scroll',
          link: 'remote-grid-virtual-scroll',
        },
        { name: '14: Grid Overall', link: 'remote-grid-overall' },
        { name: '15: Grid Remote Config All', link: 'remote-grid-remote-config' },
        { name: '16: Grid Test 2', link: 'grid-test2' },
        { name: '17: Grid In-Memory Virtual Scroll', link: 'in-memory-grid-virtual-scroll' },
        {
          name: '18: Grid In-Memory Test',
          link: 'in-memory-grid-test',
        },
        { name: '19: Grid Display Image', link: 'grid-display-image' },
        { name: '20: Grid Renderer Component', link: 'grid-renderer-component' },
        { name: '21: Grid Renderer Function', link: 'grid-renderer-function' },
        { name: '22: Grid Remote Row Group', link: 'grid-remote-row-group' },
        { name: '23: Grid In-Memory Row Group', link: 'grid-in-memory-row-group' },
        { name: '24: Grid Group Header', link: 'grid-group-header' },
        {
          name: '25: Grid Multi Row Seletion',
          link: 'grid-multi-row-selection',
        },
      ],
    },
    {
      name: 'Grid Cell Edit',
      items: [{ name: 'Grid Cell Edit Text', link: 'grid-cell-edit-text' }],
    },
    {
      name: 'Test',
      items: [{ name: 'Test Virtual Scroll', link: 'test-virtual-scroll' }],
    },
  ];
}
