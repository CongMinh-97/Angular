import { Routes } from '@angular/router';

export const ARTICLE_ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Editor · Harbor',
    data: { breadcrumb: 'Article editor' },
    loadComponent: () => import('./article-admin.component').then(m => m.ArticleAdminComponent),
  },
];

export default ARTICLE_ADMIN_ROUTES;
