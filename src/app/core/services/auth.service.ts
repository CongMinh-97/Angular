import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  user$ = this.userSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.setAuth(response.token, response.user);
      })
    );
  }

  logout(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private setAuth(token: string, user: User): void {
    this.tokenSubject.next(token);
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.setAuth(token, JSON.parse(user));
    }
  }
}
