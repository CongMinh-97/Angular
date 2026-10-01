import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@services/auth.service';

const FALLBACK: Record<number, string> = {
  0: 'Cannot reach the server. Check your connection and try again.',
  403: 'You do not have permission to do that.',
  404: 'The requested resource was not found.',
  500: 'The server hit an error. Try again in a moment.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const message = inject(NzMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // The login form shows its own inline error.
      if (req.url.endsWith('/auth/login')) return throwError(() => error);

      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        message.warning('Your session has expired. Sign in again to continue.');
      } else {
        message.error(error.error?.message || FALLBACK[error.status] || 'Something went wrong. Try again.');
      }
      return throwError(() => error);
    }),
  );
};
