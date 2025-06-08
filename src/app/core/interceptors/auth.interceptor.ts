import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../../client/UserManagement/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private publicUrls = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/verify-email',
    '/api/auth/verify',
    '/api/auth/refresh-token',
    '/api/auth/resend-verification', // For resending verification emails
    '/api/auth/forgot-password', // For password reset
    '/api/auth/reset-password', // For resetting password
    '/api/chat/ask',
    '/api/appareils',
    '/api/reservations',
    '/api/reclamations',
    'http://localhost:5000'
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request to:', request.url);
    if (this.isPublicRequest(request.url)) {
      console.log('Skipping auth interceptor for public URL:', request.url);
      return next.handle(request);
    }

    // Get the auth token
    const token = this.authService.getToken();

    // Clone the request and add the authorization header
    if (token) {
      console.log('Adding token to request');
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Response received:', {
            url: event.url,
            status: event.status
          });
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handle401Error(request, next);
          } else if (error.status === 403) {
            // Forbidden - redirect based on role
            this.handle403Error();
            return throwError(() => error);
          }
        }
        return throwError(() => error);
      })
    );
  }
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  private isPublicRequest(url: string): boolean {
    return this.publicUrls.some(publicUrl => url.includes(publicUrl));
  }
  private handle401Error(
    request: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // (tu pourrais tenter un refresh token ici)

      this.authService.logout();
      this.router.navigate(
        ['/login'],
        { queryParams: { returnUrl: this.router.url } }
      );

      //  ⬇️  renvoie un observable "vide" mais typé
      return of<HttpEvent<any>>();
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token =>
        next.handle(this.addTokenToRequest(request, token!))
      )
    );
  }


  private handle403Error(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
