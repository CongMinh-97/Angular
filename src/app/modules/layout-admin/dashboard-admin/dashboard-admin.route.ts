import { Routes } from '@angular/router';

export const DASHBOARD_ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Dashboard · Harbor',
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () => import('./dashboard-admin.component').then(m => m.DashboardAdminComponent),
  },
];

export default DASHBOARD_ADMIN_ROUTES;
