import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CredentialsLogin } from '../../shared/interfaces/credentials-login.interface';
import { LoginResponse } from '../../shared/interfaces/login-response.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'authToken';

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: CredentialsLogin): Observable<LoginResponse> {
    credentials.document = credentials.document.replace(/[^\d]/g, '');
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        this.saveToken(response.token);
      })
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
