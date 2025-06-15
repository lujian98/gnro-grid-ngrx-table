import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideNoopAnimations, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GnroOverlayModule } from '@gnro/ui/overlay';
import { GnroI18nModule } from '@gnro/ui/core';
import { GnroThemeModule } from '@gnro/ui/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule, InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { routes } from './app.routes';
import { GnroUiModulesModule } from './gnro-ui-modules/gnro-ui-modules.module';
import { InMemoryHttpInterceptor } from './mock/in-memory-http.interceptor';
import { InMemoryService } from './mock/in-memory-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InMemoryHttpInterceptor,
      multi: true,
    },
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot(
        { router: routerReducer },
        {
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false,
          },
        },
      ),
    ),
    importProvidersFrom(StoreRouterConnectingModule.forRoot({})),
    importProvidersFrom(EffectsModule.forRoot()),
    importProvidersFrom(StoreDevtoolsModule.instrument({ maxAge: 25 })),
    importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(InMemoryService, { delay: 100 })),
    importProvidersFrom(TranslateModule.forRoot({ defaultLanguage: 'en-US', extend: true })),
    //importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryService, { delay: 1000 })),
    importProvidersFrom(GnroI18nModule.forRoot()),
    importProvidersFrom(GnroThemeModule.forRoot({ name: 'dark' })),
    importProvidersFrom(GnroOverlayModule.forRoot()),
    importProvidersFrom(GnroUiModulesModule),
  ],
};
