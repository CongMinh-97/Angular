import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { noAuthGuard } from '@guards/no-auth.guard';
import { ADMIN_ROUTES } from '@shared/routing/admin-routing';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('@modules/auth/auth.route'),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./_layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: ADMIN_ROUTES,
  },
  { path: '**', redirectTo: '' },
];
