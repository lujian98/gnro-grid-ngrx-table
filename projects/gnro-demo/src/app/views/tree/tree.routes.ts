import { Routes } from '@angular/router';

import { AppDefaultTreeGridComponent } from './demos/default-tree-grid.component';
import { AppTreeRemoteDataComponent } from './demos/tree-remote-data.component';
import { AppTreeRemoteColumnDataComponent } from './demos/tree-remote-conlumn-data.component';
import { AppTreeRemoteAllComponent } from './demos/tree-remote-all.component';
import { AppTreeRemoteConfigDataComponent } from './demos/tree-remote-config-data.component';
import { AppTreeRemoteConfigColumnComponent } from './demos/tree-remote-config-column.component';
import { AppTreeRemoteConfigComponent } from './demos/tree-remote-config.component';
import { AppTreeRemoteColumnComponent } from './demos/tree-remote-column.component';

import { AppTreeComponent } from './tree.component';

export const AppTreeGridRoutes: Routes = [
  {
    path: '',
    component: AppTreeComponent,
    providers: [],
    children: [
      { path: 'app-default-tree-grid', component: AppDefaultTreeGridComponent },
      { path: 'app-tree-remote-data', component: AppTreeRemoteDataComponent },
      { path: 'app-tree-remote-conlumn-data', component: AppTreeRemoteColumnDataComponent },
      { path: 'app-tree-remote-all', component: AppTreeRemoteAllComponent },
      { path: 'app-tree-remote-config-data', component: AppTreeRemoteConfigDataComponent },
      { path: 'app-tree-remote-config-column', component: AppTreeRemoteConfigColumnComponent },
      { path: 'app-tree-remote-config', component: AppTreeRemoteConfigComponent },
      { path: 'app-tree-remote-column', component: AppTreeRemoteColumnComponent },

      {
        path: '**',
        redirectTo: 'app-default-tree-grid',
      },
    ],
  },
];
