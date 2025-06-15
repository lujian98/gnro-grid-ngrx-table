import { Routes } from '@angular/router';

import { AppDashboardDemoComponent } from './demos/dashboard-demo/dashboard-demo.component';

import { AppDashboardComponent } from './dashboard.component';

export const AppDashboardRoutes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    providers: [],
    children: [
      { path: 'dashboard-demo', component: AppDashboardDemoComponent },
      {
        path: '**',
        redirectTo: 'dashboard-demo',
      },
    ],
  },
];
