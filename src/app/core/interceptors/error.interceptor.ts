import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const message = inject(NzMessageService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        message.error('Session expired. Please login again.');
      } else if (error.status === 403) {
        message.error('You do not have permission to access this resource.');
      } else if (error.status === 404) {
        message.error('Resource not found.');
      } else if (error.status === 500) {
        message.error('Server error. Please try again later.');
      } else if (error.status === 0) {
        message.error('Network error. Please check your connection.');
      } else {
        message.error(error.error?.message || 'An error occurred.');
      }
      return throwError(() => error);
    })
  );
};
