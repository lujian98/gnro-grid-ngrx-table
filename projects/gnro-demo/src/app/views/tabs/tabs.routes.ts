import { Routes } from '@angular/router';
import { AppTabsComponent } from './tabs.component';
import { AppSimpleTabsComponent } from './demos/simple-tabs.component';
import { AppTabGroupComponent } from './demos/tab-group.component';
import { AppDoubleTabsComponent } from './demos/double-tabs.component';
import { AppTabFormComponent } from './demos/tab-form/tab-form.component';

export const AppTabsRoutes: Routes = [
  {
    path: '',
    component: AppTabsComponent,
    providers: [],
    children: [
      { path: 'simple-tabs', component: AppSimpleTabsComponent },
      { path: 'tab-group', component: AppTabGroupComponent },
      { path: 'tab-form', component: AppTabFormComponent },
      { path: 'double-tabs', component: AppDoubleTabsComponent },
      /*
      {
        path: '**',
        redirectTo: 'simple-tabs',
      },*/
    ],
  },
];
