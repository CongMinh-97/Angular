import { Routes } from '@angular/router';

/** Child routes of the admin layout (_layouts/admin-layout). Each module owns its own *.route.ts. */
export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadChildren: () => import('@modules/layout-admin/dashboard-admin/dashboard-admin.route') },
  { path: 'users', loadChildren: () => import('@modules/layout-admin/user-admin/user-admin.route') },
  { path: 'import', loadChildren: () => import('@modules/layout-admin/import-user-admin/import-user-admin.route') },
  { path: 'editor', loadChildren: () => import('@modules/layout-admin/article-admin/article-admin.route') },
  // Design system pages: /components and /ui-kit
  { path: '', loadChildren: () => import('@modules/design-system/design-system.route') },
];
