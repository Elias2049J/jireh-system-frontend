import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { JwtResponseDTO } from '../models/jwt-response.model';
import { jwtDecode } from 'jwt-decode';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = ApiUrl.URL+"/auth";
  private tokenKey: string = 'jireh_auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initAuthFromStorage();
  }

  private initAuthFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userInfo = this.extractUserInfoFromToken(decodedToken);
        this.currentUserSubject.next(userInfo);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }

  private extractUserInfoFromToken(decodedToken: any): UserModel {
    // Backend stores the roles as a list with key "roles"
    const roles = decodedToken.roles || [];
    let userRole = '';

    if (roles.length > 0) {
      // Get first role and delete the prefix ROLE_ if it exists
      userRole = roles[0].replace(/^ROLE_/, '');
    }

    return {
      idUser: null,
      name: decodedToken.sub,
      pass: '',
      active: true,
      role: userRole
    };
  }

  login(credentials: { name: string, pass: string }): Observable<boolean> {
    return this.http.post<JwtResponseDTO>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.token) {
            // Save token in localStorage
            localStorage.setItem(this.tokenKey, response.token);

            // Decode token for getting user info
            const decodedToken: any = jwtDecode(response.token);
            const userInfo = this.extractUserInfoFromToken(decodedToken);

            // Update auth state
            this.currentUserSubject.next(userInfo);
            this.isAuthenticatedSubject.next(true);

            return true;
          }
          return false;
        })
      );
  }

  logout(): void {
    // Delete token from localStorage
    localStorage.removeItem(this.tokenKey);

    // Update auth state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Redirect al login-page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }

  // Verifying roles specific methods
  isAdmin(): boolean {
    return this.hasRole(['ADMIN']);
  }

  isCashier(): boolean {
    return this.hasRole(['CASHIER', 'ADMIN']);
  }

  isWaiter(): boolean {
    return this.hasRole(['WAITER', 'ADMIN']);
  }
}
