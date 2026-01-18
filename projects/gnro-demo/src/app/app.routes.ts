import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.routes').then((m) => m.AppDashboardRoutes),
      },
      {
        path: 'grid',
        loadChildren: () => import('./views/grid/grid.routes').then((m) => m.AppGridRoutes),
      },
      /*
      {
        path: 'tree',
        loadChildren: () => import('./views/tree/tree.routes').then((m) => m.AppTreeGridRoutes),
      },
      */
      {
        path: 'form',
        loadChildren: () => import('./views/form/form.routes').then((m) => m.AppFormRoutes),
      },
      {
        path: 'select',
        loadChildren: () => import('./views/select/select.routes').then((m) => m.AppSelectRoutes),
      },
      {
        path: 'menu',
        loadChildren: () => import('./views/menu/menu.routes').then((m) => m.AppMenuRoutes),
      },
      {
        path: 'date',
        loadChildren: () => import('./views/date/date.routes').then((m) => m.AppDateRoutes),
      },
      {
        path: 'tabs',
        loadChildren: () => import('./views/tabs/tabs.routes').then((m) => m.AppTabsRoutes),
      },
      {
        path: 'd3',
        loadChildren: () => import('./views/d3/d3.routes').then((m) => m.AppD3Routes),
      },
      {
        path: 'layout',
        loadChildren: () => import('./views/layout/layout.routes').then((m) => m.AppLayoutRoutes),
      },
      {
        path: 'window',
        loadChildren: () => import('./views/window/window.routes').then((m) => m.AppWindowRoutes),
      },
      {
        path: 'state',
        loadChildren: () => import('./views/state/state.routes').then((m) => m.AppStateRoutes),
      },
      {
        path: 'entity-tabs',
        loadChildren: () => import('./views/entity-tabs/entity-tabs.routes').then((m) => m.AppEntityTabsRoutes),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
