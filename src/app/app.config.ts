import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { errorInterceptor } from '@interceptors/error.interceptor';
import { httpInterceptor } from '@interceptors/http.interceptor';
import { mockBackendInterceptor } from '@core/mock/mock-backend.interceptor';
import { routes } from './app.routes';
import { APP_ICONS } from './icons';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // Order matters: auth header → error handling → (dev) mock backend.
    provideHttpClient(withInterceptors([httpInterceptor, errorInterceptor, mockBackendInterceptor])),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    provideNzIcons(APP_ICONS),
    provideNzConfig({
      message: { nzTop: 72, nzDuration: 2800 },
      notification: { nzPlacement: 'bottomRight' },
      table: { nzSize: 'middle' },
    }),
  ],
};
