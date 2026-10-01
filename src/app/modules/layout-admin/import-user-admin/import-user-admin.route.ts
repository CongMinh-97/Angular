import { Routes } from '@angular/router';

export const IMPORT_USER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Import · Harbor',
    data: { breadcrumb: 'Import users' },
    loadComponent: () => import('./import-user-admin.component').then(m => m.ImportUserAdminComponent),
  },
];

export default IMPORT_USER_ADMIN_ROUTES;
