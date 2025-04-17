import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api';
    private readonly AUTH_TOKEN_KEY = 'auth_token';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // User authentication
  login(email: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // User registration with profile picture upload
  // auth.service.ts


register(userData: any): Observable<any> {
  const formData = new FormData();
  
  Object.keys(userData).forEach(key => {
    if (key !== 'photoDeProfil' && key !== 'recaptchaToken'|| userData[key] === null) {
      formData.append(key, userData[key]);
    }
  });
  
  if (userData.photoDeProfil) {
    formData.append('photoDeProfil', userData.photoDeProfil, userData.photoDeProfil.name);
  }
  //recaptcha
  if (userData.recaptchaToken) {
    formData.append('recaptchaToken', userData.recaptchaToken);
  }
  
  return this.http.post<any>(`${this.apiUrl}/auth/register`, formData).pipe(
    tap(response => {
      if (response.token) {
        this.storeToken(response.token);
      }
    }),
    catchError(error => throwError(() => error))
  );
}

// Add these token management methods
storeToken(token: string): void {
  localStorage.setItem(this.AUTH_TOKEN_KEY, token);
}



removeToken(): void {
  localStorage.removeItem(this.AUTH_TOKEN_KEY);
}

isLoggedIn(): boolean {
  return !!this.getToken();
}
  // Step 1: Request password reset (send OTP)
  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    return this.http.post(`${this.apiUrl}/forgotPassword/verifyMail/${email}`, {}, {
      headers,
      responseType: 'text'
    }).pipe(
      tap(response => {
        // La réponse est maintenant traitée comme du texte
        console.log('Réponse du serveur:', response);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Step 2: Verify OTP
  verifyOtp(otp: number, email: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    return this.http.post(`${this.apiUrl}/forgotPassword/verifyOtp/${otp}/${email}`, {}, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Step 3: Change password
  changePassword(email: string, password: string, repeatPassword: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    return this.http.post(`${this.apiUrl}/forgotPassword/changePassword/${email}`, {
      password,
      repeatPassword
    }, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Handle successful authentication
  private handleAuthSuccess(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify({
      id: response.id,
      email: response.email,
      role: response.role
    }));
    this.currentUserSubject.next(response);
    this.redirectBasedOnRole(response.role);
  }

  // Redirect user based on role
  private redirectBasedOnRole(role: string): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);//a revoir
    } else {
      this.router.navigate(['/home']);//à revoir
    }
  }

  // Load user data from storage on app initialization
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  // Get current user information
  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // User logout
  logout(): void {
    // Call the backend logout endpoint if you have one
    // this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Clear any other stored user data
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    
    // Update behavior subject
    this.currentUserSubject.next(null);
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}

// Response interface for login
interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  role: string;
}