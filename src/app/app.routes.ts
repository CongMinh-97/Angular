import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@guards/auth.guard';
import { LayoutComponent } from '@shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Sign in · Harbor',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · Harbor',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        title: 'Users · Harbor',
        data: { breadcrumb: 'Users' },
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'import',
        title: 'Import · Harbor',
        data: { breadcrumb: 'Import users' },
        loadComponent: () => import('./features/import/import.component').then(m => m.ImportComponent),
      },
      {
        path: 'editor',
        title: 'Editor · Harbor',
        data: { breadcrumb: 'Article editor' },
        loadComponent: () => import('./features/editor/editor-page.component').then(m => m.EditorPageComponent),
      },
      {
        path: 'components',
        title: 'Components · Harbor',
        data: { breadcrumb: 'Components' },
        loadComponent: () => import('./features/components/components-page.component').then(m => m.ComponentsPageComponent),
      },
      {
        path: 'ui-kit',
        title: 'Foundations · Harbor',
        data: { breadcrumb: 'Foundations' },
        loadComponent: () => import('./features/ui-kit/ui-kit.component').then(m => m.UiKitComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
