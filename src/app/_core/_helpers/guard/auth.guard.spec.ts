import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  function run(loggedIn: boolean): boolean | UrlTree {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { isAuthenticated: () => loggedIn } }],
    });
    const state = { url: '/users?page=2' } as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, state)) as boolean | UrlTree;
  }

  it('lets signed-in users through', () => {
    expect(run(true)).toBeTrue();
  });

  it('redirects guests to /login and keeps the target url', () => {
    const result = run(false);
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/login?returnUrl=%2Fusers%3Fpage%3D2');
  });
});
