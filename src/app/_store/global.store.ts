import { Injectable, signal } from '@angular/core';

const SIDEBAR_KEY = 'sidebar-collapsed';

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

/**
 * App-wide UI state shared by the layout pieces (aside, header) and pages.
 * Signals instead of @ngrx/component-store: same role, no extra dependency.
 */
@Injectable({ providedIn: 'root' })
export class GlobalStore {
  private readonly _sidebarCollapsed = signal(readFlag(SIDEBAR_KEY));
  private readonly _mobileMenuOpen = signal(false);

  /** Desktop: sidebar shrunk to an icon rail. Remembered across reloads. */
  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  /** Phones/tablets: sidebar shown as a drawer over the page. */
  readonly mobileMenuOpen = this._mobileMenuOpen.asReadonly();

  toggleSidebar(): void {
    this._sidebarCollapsed.update(v => !v);
    try {
      localStorage.setItem(SIDEBAR_KEY, String(this._sidebarCollapsed()));
    } catch {
      /* storage unavailable */
    }
  }

  openMobileMenu(): void {
    this._mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this._mobileMenuOpen.set(false);
  }
}
