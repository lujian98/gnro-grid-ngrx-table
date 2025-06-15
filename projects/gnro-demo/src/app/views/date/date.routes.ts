import { Routes } from '@angular/router';
import { AppSimpleDateComponent } from './demos/simple-date/simple-date.component';

import { AppDateComponent } from './date.component';

export const AppDateRoutes: Routes = [
  {
    path: '',
    component: AppDateComponent,
    providers: [],
    children: [
      { path: 'simple-date', component: AppSimpleDateComponent },
      {
        path: '**',
        redirectTo: 'simple-date',
      },
    ],
  },
];
