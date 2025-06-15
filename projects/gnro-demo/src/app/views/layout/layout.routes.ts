import { Routes } from '@angular/router';
import { AppLayoutHorizontalComponent } from './demos/layout-horizontal.component';
import { AppHorizontalLeftCenterComponent } from './demos/horizontal-left-center.component';
import { AppHorizontalCenterRightComponent } from './demos/horizontal-center-right.component';
import { AppHorizontalLeftRightComponent } from './demos/horizontal-left-right.component';
import { AppLayoutHorizontalAllComponent } from './demos/layout-horizontal-all.component';

import { AppLayoutVerticalComponent } from './demos/layout-vertical.component';
import { AppVerticalTopMiddleComponent } from './demos/vertical-top-middle.component';
import { AppVerticalMiddleBottomComponent } from './demos/vertical-middle-bottom.component';
import { AppVerticalTopBottomComponent } from './demos/vertical-top-bottom.component';
import { AppLayoutVerticalAllComponent } from './demos/layout-vertical-all.component';
import { AppLayoutHorizontalVerticalComponent } from './demos/layout-horizontal-vertical.component';

import { AppLayoutResizeableComponent } from './demos/layout-resizeable.component';

import { AppAccordionLayoutComponent } from './demos/accordion-layout.component';

import { AppLayoutComponent } from './layout.component';

export const AppLayoutRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    providers: [],
    children: [
      { path: 'horizontal-layout', component: AppLayoutHorizontalComponent },
      { path: 'horizontal-left-center', component: AppHorizontalLeftCenterComponent },
      { path: 'horizontal-center-right', component: AppHorizontalCenterRightComponent },
      { path: 'horizontal-left-right', component: AppHorizontalLeftRightComponent },
      { path: 'layout-horizontal-all', component: AppLayoutHorizontalAllComponent },

      { path: 'layout-vertical', component: AppLayoutVerticalComponent },
      { path: 'vertical-top-middle', component: AppVerticalTopMiddleComponent },
      { path: 'vertical-middle-bottom', component: AppVerticalMiddleBottomComponent },
      { path: 'vertical-top-bottom', component: AppVerticalTopBottomComponent },
      { path: 'layout-vertical-all', component: AppLayoutVerticalAllComponent },

      { path: 'layout-horizontal-vertical', component: AppLayoutHorizontalVerticalComponent },

      { path: 'layout-resizeable', component: AppLayoutResizeableComponent },
      { path: 'accordion-layout', component: AppAccordionLayoutComponent },

      {
        path: '**',
        redirectTo: 'horizontal-layout',
      },
    ],
  },
];
