import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { filter, map } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { GlobalStore } from '@store/global.store';
import { UiAvatarComponent } from '@ui';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NzIconModule, NzButtonModule, NzDropDownModule, NzMenuModule, NzBadgeModule, UiAvatarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly store = inject(GlobalStore);

  readonly appName = environment.appName;
  readonly user = this.auth.user;

  readonly notifications = [
    { icon: 'user-add', tone: 'jade', text: '3 people accepted their invitation', time: '12 min ago' },
    { icon: 'cloud-upload', tone: 'violet', text: 'Import finished: 42 users added, 2 skipped', time: '1 h ago' },
    { icon: 'warning', tone: 'coral', text: 'Invoice #INV-2091 is 5 days overdue', time: 'Yesterday' },
  ];

  /** Breadcrumb label comes from the deepest active route's data.breadcrumb. */
  readonly crumb = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.currentCrumb()),
    ),
    { initialValue: this.currentCrumb() },
  );

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private currentCrumb(): string {
    let r = this.route.snapshot;
    while (r.firstChild) r = r.firstChild;
    return r.data['breadcrumb'] ?? '';
  }
}
