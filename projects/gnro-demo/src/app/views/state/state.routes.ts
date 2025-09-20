import { Routes } from '@angular/router';
import { AppDataStoreComponent } from './demos/extends/data-store.component';
import { AppReducerManagerComponent } from './demos/reducer-manager/app-reducer-manager.component';

import { AppStateComponent } from './state.component';

export const AppStateRoutes: Routes = [
  {
    path: '',
    component: AppStateComponent,
    providers: [],
    children: [
      { path: 'data-store', component: AppDataStoreComponent },
      { path: 'reducer-manager', component: AppReducerManagerComponent },
      {
        path: '**',
        redirectTo: 'data-store',
      },
    ],
  },
];
