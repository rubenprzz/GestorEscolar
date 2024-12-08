import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() {
    const token = this.getToken();
    if (token) {
      this.setCurrentUser(token);
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.setCurrentUser(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): any {
    const token = this.getToken();
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  private setCurrentUser(token: string): void {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.currentUserSubject.next(decodedToken);
  }
  logout(): void {
    this.removeToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.role || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUserSubject.asObservable();
  }
}
