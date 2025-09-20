import { Routes } from '@angular/router';
import { AppDataStoreComponent } from './demos/data/data-store.component';
import { AppStateComponent } from './state.component';

export const AppStateRoutes: Routes = [
  {
    path: '',
    component: AppStateComponent,
    providers: [],
    children: [
      { path: 'data-store', component: AppDataStoreComponent },
      {
        path: '**',
        redirectTo: 'data-store',
      },
    ],
  },
];
