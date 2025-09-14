import { Routes } from '@angular/router';
import { AppSimpleWindowComponent } from './demos/simple-window/simple-window.component';
import { AppMessageComponent } from './demos/message/message.component';
import { AppDataStoreComponent } from './demos/data/data-store.component';

import { AppWindowComponent } from './window.component';

export const AppWindowRoutes: Routes = [
  {
    path: '',
    component: AppWindowComponent,
    providers: [],
    children: [
      { path: 'simple-window', component: AppSimpleWindowComponent },
      { path: 'message', component: AppMessageComponent },
      { path: 'data-store', component: AppDataStoreComponent },
      {
        path: '**',
        redirectTo: 'simple-window',
      },
    ],
  },
];
