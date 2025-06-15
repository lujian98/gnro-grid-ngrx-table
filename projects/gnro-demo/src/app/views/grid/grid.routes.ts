import { Routes } from '@angular/router';
import { AppGridComponent } from './grid.component';

import { AppDefaultGridComponent } from './in-memory-data/default-grid.component';
import { AppSimpleGridComponent } from './remote-data/simple-grid.component';
import { AppGridFilterComponent } from './remote-data/grid-filter.component';
import { AppGridSortComponent } from './remote-data/grid-sort.component';
import { AppGridColumnResizeComponent } from './remote-data/grid-column-resize.component';
import { AppGridColumnReorderComponent } from './remote-data/grid-column-reorder.component';
import { AppGridColumnMenuComponent } from './remote-data/grid-column-menu.component';
import { AppGridColumnHiddenComponent } from './remote-data/grid-column-hidden.component';
import { AppGridRemoteColumnConfigComponent } from './remote-data/grid-remote-column-config.component';
import { AppGridRowSelectionComponent } from './remote-data/grid-row-selection.component';
import { AppGridPageComponent } from './remote-data/grid-page.component';
import { AppGridVerticalScrollComponent } from './remote-data/grid-vertical-scroll.component';
import { AppGridHorizontalScrollComponent } from './remote-data/grid-horizontal-scroll.component';
import { AppGridRemoteVirtualScrollComponent } from './remote-data/grid-virtual-scroll.component';
import { AppGridOverallComponent } from './remote-data/grid-overall.component';
import { AppGridRemoteConfigComponent } from './remote-data/grid-remote-config.component';

import { AppGridTest2Component } from './remote-data/grid-test2.component';

import { AppGridinMemoryTestComponent } from './in-memory-data/grid-in-memory-test.component';
import { AppGridVirtualScrollComponent } from './in-memory-data/grid-virtual-scroll.component';
import { AppGridImageComponent } from './in-memory-data/grid-image.component';
import { AppGridRendererComponent } from './in-memory-data/grid-renderer-component.component';
import { AppGridRendererFunctionComponent } from './in-memory-data/grid-renderer-function.component';
import { AppGridRemoteRowGroupComponent } from './remote-data/grid-remote-row-group.component';
import { AppGridRowGroupComponent } from './in-memory-data/grid-row-group.component';
import { AppGridGroupHeaderComponent } from './remote-data/grid-group-header.component';
import { AppGridMultiRowSelectionComponent } from './remote-data/grid-multi-row-selection.component';

import { AppTestVirtualScrollComponent } from './in-memory-data/test-virtual-scroll.component';

import { AppGridCellEditTextComponent } from './edit/grid-cell-edit-text.component';

export const AppGridRoutes: Routes = [
  {
    path: '',
    component: AppGridComponent,
    providers: [],
    children: [
      { path: 'app-default-grid', component: AppDefaultGridComponent },
      { path: 'remote-simple-grid', component: AppSimpleGridComponent },
      { path: 'remote-grid-sort', component: AppGridSortComponent },
      { path: 'remote-grid-filter', component: AppGridFilterComponent },
      {
        path: 'remote-grid-column-resize',
        component: AppGridColumnResizeComponent,
      },
      {
        path: 'remote-grid-column-reorder',
        component: AppGridColumnReorderComponent,
      },
      {
        path: 'remote-grid-column-menu',
        component: AppGridColumnMenuComponent,
      },
      {
        path: 'remote-grid-column-hidden',
        component: AppGridColumnHiddenComponent,
      },
      {
        path: 'remote-grid-remote-column-config',
        component: AppGridRemoteColumnConfigComponent,
      },
      {
        path: 'remote-grid-row-selection',
        component: AppGridRowSelectionComponent,
      },
      { path: 'remote-grid-page', component: AppGridPageComponent },
      { path: 'remote-grid-vertical-scroll', component: AppGridVerticalScrollComponent },
      {
        path: 'remote-grid-horizontal-scroll',
        component: AppGridHorizontalScrollComponent,
      },
      {
        path: 'remote-grid-virtual-scroll',
        component: AppGridRemoteVirtualScrollComponent,
      },
      { path: 'remote-grid-overall', component: AppGridOverallComponent },
      { path: 'remote-grid-remote-config', component: AppGridRemoteConfigComponent },
      {
        path: 'grid-test2',
        component: AppGridTest2Component,
      },
      { path: 'in-memory-grid-test', component: AppGridinMemoryTestComponent },
      { path: 'in-memory-grid-virtual-scroll', component: AppGridVirtualScrollComponent },
      { path: 'grid-display-image', component: AppGridImageComponent },
      { path: 'grid-renderer-component', component: AppGridRendererComponent },
      { path: 'grid-renderer-function', component: AppGridRendererFunctionComponent },
      { path: 'grid-remote-row-group', component: AppGridRemoteRowGroupComponent },
      { path: 'grid-in-memory-row-group', component: AppGridRowGroupComponent },
      { path: 'grid-group-header', component: AppGridGroupHeaderComponent },
      { path: 'grid-multi-row-selection', component: AppGridMultiRowSelectionComponent },

      { path: 'grid-cell-edit-text', component: AppGridCellEditTextComponent },

      { path: 'test-virtual-scroll', component: AppTestVirtualScrollComponent },

      {
        path: '**',
        redirectTo: 'grid-multi-row-selection',
      },
    ],
  },
];
