import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '@services/auth.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let message: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/users' });
    message = jasmine.createSpyObj<NzMessageService>('NzMessageService', ['warning', 'error']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: NzMessageService, useValue: message },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  function fail(url: string, status: number, body: object | null = null): jasmine.Spy {
    const onError = jasmine.createSpy('error');
    http.get(url).subscribe({ error: onError });
    backend.expectOne(url).flush(body, { status, statusText: 'x' });
    return onError;
  }

  it('signs out and redirects to /login with returnUrl on 401', () => {
    const onError = fail('/api/users', 401);
    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/users' } });
    expect(onError).toHaveBeenCalled();
  });

  it('shows the server message when present', () => {
    fail('/api/users', 409, { message: 'Email already exists' });
    expect(message.error).toHaveBeenCalledWith('Email already exists');
  });

  it('falls back to a status message', () => {
    fail('/api/users', 404);
    expect(message.error).toHaveBeenCalledWith('The requested resource was not found.');
  });

  it('lets the login form handle its own errors', () => {
    const onError = fail('/api/auth/login', 401);
    expect(auth.logout).not.toHaveBeenCalled();
    expect(message.warning).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
