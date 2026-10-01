import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Sign in · Harbor',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
];

export default AUTH_ROUTES;
