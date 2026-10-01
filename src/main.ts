import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { httpInterceptor } from '@interceptors/http.interceptor';
import { errorInterceptor } from '@interceptors/error.interceptor';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  nz: {
    locale: en_US,
  },
};

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor, errorInterceptor])
    ),
    importProvidersFrom(),
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
}).catch(err => console.error(err));
