import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { filter, map } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { UiAvatarComponent } from '@ui';
import { LogoComponent } from '../logo/logo.component';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NzIconModule, NzButtonModule, NzDropDownModule, NzMenuModule, NzBadgeModule, NzToolTipModule, LogoComponent, UiAvatarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly appName = environment.appName;
  readonly mockApi = environment.mockApi;
  readonly user = this.auth.user;

  collapsed = signal(this.readCollapsed());
  mobileOpen = signal(false);

  readonly nav: NavGroup[] = [
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

  readonly notifications = [
    { icon: 'user-add', tone: 'jade', text: '3 people accepted their invitation', time: '12 min ago' },
    { icon: 'cloud-upload', tone: 'violet', text: 'Import finished: 42 users added, 2 skipped', time: '1 h ago' },
    { icon: 'warning', tone: 'coral', text: 'Invoice #INV-2091 is 5 days overdue', time: 'Yesterday' },
  ];

  readonly crumb = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.currentCrumb()),
    ),
    { initialValue: this.currentCrumb() },
  );

  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
    try {
      localStorage.setItem('sidebar-collapsed', String(this.collapsed()));
    } catch {
      /* storage unavailable */
    }
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('global-search')?.focus();
    }
    if (e.key === 'Escape') this.closeMobile();
  }

  private currentCrumb(): string {
    let r = this.route.snapshot;
    while (r.firstChild) r = r.firstChild;
    return r.data['breadcrumb'] ?? '';
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  }
}
