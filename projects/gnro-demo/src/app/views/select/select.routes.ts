import { Routes } from '@angular/router';
import { AppSimpleSelectComponent } from './demos/simple-select/simple-select.component';

import { AppSelectComponent } from './select.component';
import { AppStringArrayComponent } from './demos/string-array/string-array.component';

export const AppSelectRoutes: Routes = [
  {
    path: '',
    component: AppSelectComponent,
    providers: [],
    children: [
      { path: 'simple-select', component: AppSimpleSelectComponent },
      { path: 'string-array', component: AppStringArrayComponent },
      {
        path: '**',
        redirectTo: 'simple-select',
      },
    ],
  },
];
