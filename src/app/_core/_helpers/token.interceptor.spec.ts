import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@services/auth.service';
import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let token: string | null;

  beforeEach(() => {
    token = null;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken: () => token } },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('adds the bearer header when signed in', () => {
    token = 'abc';
    http.get('/api/users').subscribe();
    expect(backend.expectOne('/api/users').request.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('leaves the request untouched when signed out', () => {
    http.get('/api/users').subscribe();
    expect(backend.expectOne('/api/users').request.headers.has('Authorization')).toBeFalse();
  });

  it('does not force a Content-Type on FormData uploads', () => {
    token = 'abc';
    http.post('/api/uploads', new FormData()).subscribe();
    expect(backend.expectOne('/api/uploads').request.headers.has('Content-Type')).toBeFalse();
  });
});
