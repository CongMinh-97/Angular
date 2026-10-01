import { Routes } from '@angular/router';

export const DESIGN_SYSTEM_ROUTES: Routes = [
  {
    path: 'components',
    title: 'Components · Harbor',
    data: { breadcrumb: 'Components' },
    loadComponent: () => import('./ui-components/ui-components.component').then(m => m.UiComponentsComponent),
  },
  {
    path: 'ui-kit',
    title: 'Foundations · Harbor',
    data: { breadcrumb: 'Foundations' },
    loadComponent: () => import('./foundations/foundations.component').then(m => m.FoundationsComponent),
  },
];

export default DESIGN_SYSTEM_ROUTES;
