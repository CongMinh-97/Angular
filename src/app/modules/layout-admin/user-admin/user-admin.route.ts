import { Routes } from '@angular/router';

export const USER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Users · Harbor',
    data: { breadcrumb: 'Users' },
    loadComponent: () => import('./user-admin.component').then(m => m.UserAdminComponent),
  },
];

export default USER_ADMIN_ROUTES;
