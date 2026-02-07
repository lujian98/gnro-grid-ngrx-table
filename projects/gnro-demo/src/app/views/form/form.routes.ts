import { Routes } from '@angular/router';
import { AppSimpleFromDemoComponent } from './demos/simple-form.component';
import { AppThemeFormDemoComponent } from './demos/theme-form.component';
import { AppFromPageDemoComponent } from './demos/form-page.component';
import { AppPasswordPageDemoComponent } from './demos/password-page.component';
import { AppFileDropDemoComponent } from './demos/file-drop.component';
import { AppFileDropUploadComponent } from './demos/file-drop-upload.component';
import { AppFileSelectUploadComponent } from './demos/file-select-upload.component';
import { AppUrlContentSaveFileComponent } from './url-content-save-file/url-content-save-file.component';
import { AppFormComponent } from './form.component';

export const AppFormRoutes: Routes = [
  {
    path: '',
    component: AppFormComponent,
    providers: [],
    children: [
      { path: 'simple-form', component: AppSimpleFromDemoComponent },
      { path: 'theme-form', component: AppThemeFormDemoComponent },
      { path: 'form-page', component: AppFromPageDemoComponent },
      { path: 'password-page', component: AppPasswordPageDemoComponent },
      { path: 'file-drop', component: AppFileDropDemoComponent },
      { path: 'file-drop-upload', component: AppFileDropUploadComponent },
      { path: 'file-select-upload', component: AppFileSelectUploadComponent },
      { path: 'url-content-save-file', component: AppUrlContentSaveFileComponent },
      {
        path: '**',
        redirectTo: 'form-page',
      },
    ],
  },
];
