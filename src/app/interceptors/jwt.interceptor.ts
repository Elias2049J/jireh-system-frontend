import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclude login-page route from interception
    if (this.isPublic(request.url)) {
      return next.handle(request);
    }

    // Get JWT token from authService
    const token = this.authService.getToken();

    // If there is a token, clone the request and add the authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Logtout when the token expires
          this.authService.logout();
        }
        return throwError(() => err);
      })
    );    
  }

  private isPublic(url: string): boolean {
    return url.includes('/auth/login-page')
        || url.includes('/auth/login')
        || url.includes('/health')
        || url.includes('/actuator/health');
  }
}
