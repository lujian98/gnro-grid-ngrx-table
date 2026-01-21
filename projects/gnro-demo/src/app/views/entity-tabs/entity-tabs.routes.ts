import { Routes } from '@angular/router';
import { AppEntityTabsComponent } from './entity-tabs.component';
import { AppLocationTabsComponent } from './src/location/location-tabs.component';
import { AppSimpleTabsComponent } from '../tabs/demos/simple-tabs.component';

export const AppEntityTabsRoutes: Routes = [
  {
    path: '',
    component: AppEntityTabsComponent,
    providers: [],
    children: [
      { path: 'location-tabs', component: AppLocationTabsComponent },
      { path: 'simple-tabs', component: AppSimpleTabsComponent },
      {
        path: '**',
        redirectTo: 'location-tabs',
      },
    ],
  },
];
