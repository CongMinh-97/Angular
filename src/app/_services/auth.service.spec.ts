import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { clearStorage, makeUser } from '../../testing/test-helpers';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let http: HttpTestingController;

  function setup(): AuthService {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  beforeEach(clearStorage);
  afterEach(() => {
    http.verify();
    clearStorage();
  });

  it('starts signed out when storage is empty', () => {
    const auth = setup();
    expect(auth.isLoggedIn()).toBeFalse();
    expect(auth.user()).toBeNull();
  });

  it('stores the session in localStorage when "remember me" is on', () => {
    const auth = setup();
    const user = makeUser();

    auth.login({ username: 'admin', password: 'x' }).subscribe();
    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 't-1', user });

    expect(auth.getToken()).toBe('t-1');
    expect(auth.user()).toEqual(user);
    expect(localStorage.getItem('token')).toBe('t-1');
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('uses sessionStorage when "remember me" is off', () => {
    const auth = setup();
    auth.login({ username: 'admin', password: 'x' }, false).subscribe();
    http.expectOne('/api/auth/login').flush({ token: 't-2', user: makeUser() });

    expect(sessionStorage.getItem('token')).toBe('t-2');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores a saved session and drops a corrupt user entry', () => {
    localStorage.setItem('token', 't-3');
    localStorage.setItem('user', JSON.stringify(makeUser()));
    expect(setup().isLoggedIn()).toBeTrue();

    TestBed.resetTestingModule();
    clearStorage();
    localStorage.setItem('token', 't-4');
    localStorage.setItem('user', '{broken');
    expect(setup().isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('logout clears both storages', () => {
    sessionStorage.setItem('token', 't');
    sessionStorage.setItem('user', JSON.stringify(makeUser()));
    const auth = setup();

    auth.logout();

    expect(auth.isLoggedIn()).toBeFalse();
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});
