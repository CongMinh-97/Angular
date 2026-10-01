import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginRequest, LoginResponse, User } from '@models/auth.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private state = signal<{ token: string | null; user: User | null }>(this.restore());

  readonly user = computed(() => this.state().user);
  readonly isLoggedIn = computed(() => !!this.state().token);

  login(request: LoginRequest, remember = true): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(TOKEN_KEY, res.token);
        store.setItem(USER_KEY, JSON.stringify(res.user));
        this.state.set({ token: res.token, user: res.user });
      }),
    );
  }

  logout(): void {
    for (const store of [localStorage, sessionStorage]) {
      store.removeItem(TOKEN_KEY);
      store.removeItem(USER_KEY);
    }
    this.state.set({ token: null, user: null });
  }

  getToken(): string | null {
    return this.state().token;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  private restore(): { token: string | null; user: User | null } {
    for (const store of [localStorage, sessionStorage]) {
      const token = store.getItem(TOKEN_KEY);
      const user = store.getItem(USER_KEY);
      if (token && user) {
        try {
          return { token, user: JSON.parse(user) };
        } catch {
          store.removeItem(USER_KEY);
        }
      }
    }
    return { token: null, user: null };
  }
}
