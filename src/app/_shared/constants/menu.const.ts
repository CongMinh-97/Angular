export interface MenuItem {
  label: string;
  icon: string;
  link: string;
  badge?: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

/** Sidebar of the admin layout. Paths match _shared/routing/admin-routing.ts. */
export const ADMIN_MENU: MenuGroup[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', link: '/dashboard' }] },
  {
    title: 'Management',
    items: [
      { label: 'Users', icon: 'team', link: '/users' },
      { label: 'Import users', icon: 'cloud-upload', link: '/import' },
    ],
  },
  { title: 'Content', items: [{ label: 'Article editor', icon: 'edit', link: '/editor' }] },
  {
    title: 'Design system',
    items: [
      { label: 'Components', icon: 'build', link: '/components' },
      { label: 'Foundations', icon: 'bg-colors', link: '/ui-kit' },
    ],
  },
];
