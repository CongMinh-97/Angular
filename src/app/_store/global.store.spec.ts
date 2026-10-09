import { TestBed } from '@angular/core/testing';
import { GlobalStore } from './global.store';

describe('GlobalStore', () => {
  beforeEach(() => localStorage.removeItem('sidebar-collapsed'));
  afterEach(() => localStorage.removeItem('sidebar-collapsed'));

  it('toggles the sidebar and remembers it', () => {
    const store = TestBed.inject(GlobalStore);
    expect(store.sidebarCollapsed()).toBeFalse();

    store.toggleSidebar();

    expect(store.sidebarCollapsed()).toBeTrue();
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
  });

  it('reads the saved sidebar state on start', () => {
    localStorage.setItem('sidebar-collapsed', 'true');
    expect(TestBed.inject(GlobalStore).sidebarCollapsed()).toBeTrue();
  });

  it('opens and closes the mobile menu', () => {
    const store = TestBed.inject(GlobalStore);
    store.openMobileMenu();
    expect(store.mobileMenuOpen()).toBeTrue();
    store.closeMobileMenu();
    expect(store.mobileMenuOpen()).toBeFalse();
  });
});
