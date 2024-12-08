import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {provideAnimations} from '@angular/platform-browser/animations';
import {DialogService} from 'primeng/dynamicdialog';
import {AuthInterceptor} from './auth.interceptor';
import {AuthGuard} from './auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    MessageService,
    provideAnimations(),
    DialogService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
};
