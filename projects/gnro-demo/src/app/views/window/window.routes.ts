import { Routes } from '@angular/router';
import { AppSimpleWindowComponent } from './demos/simple-window/simple-window.component';
import { AppConfirmationComponent } from './demos/confirmation/confirmation.component';

import { AppWindowComponent } from './window.component';

export const AppWindowRoutes: Routes = [
  {
    path: '',
    component: AppWindowComponent,
    providers: [],
    children: [
      { path: 'simple-window', component: AppSimpleWindowComponent },
      { path: 'confirmation', component: AppConfirmationComponent },
      {
        path: '**',
        redirectTo: 'simple-window',
      },
    ],
  },
];
