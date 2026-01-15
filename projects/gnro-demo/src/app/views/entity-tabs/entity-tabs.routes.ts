import { Routes } from '@angular/router';
import { AppEntityTabsComponent } from './entity-tabs.component';
import { AppLocationTabsComponent } from './src/locations/location-tabs.component';

export const AppEntityTabsRoutes: Routes = [
  {
    path: '',
    component: AppEntityTabsComponent,
    providers: [],
    children: [{ path: 'location-tabs', component: AppLocationTabsComponent }],
  },
];
