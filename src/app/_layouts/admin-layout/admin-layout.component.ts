import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from '@store/global.store';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';

/** Shell for every signed-in page: aside (navigation) + header (breadcrumb, search, user) + routed content. */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AsideComponent, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  readonly store = inject(GlobalStore);

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('global-search')?.focus();
    }
    if (e.key === 'Escape') this.store.closeMobileMenu();
  }
}
