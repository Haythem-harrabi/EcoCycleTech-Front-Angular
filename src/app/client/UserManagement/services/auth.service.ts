import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
declare var google: any;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api';
    private readonly AUTH_TOKEN_KEY = 'auth_token';
    private readonly USER_DATA_KEY = 'user_data';
    private readonly TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  private refreshTokenTimeout: any;

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();
  private _emailVerified$ = new BehaviorSubject<boolean>(false);
  emailVerified$          = this._emailVerified$.asObservable();


  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone:NgZone,
    private socialAuthService: SocialAuthService
  ) {
    this.startTokenRefreshTimer();
    this.loadUserFromStorage();

    // Subscribe to social auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.processSocialLogin(user);
      }
    });
  }
  saveUnverifiedUser(user: any) {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    /* drapeau pour le point rouge                                 */
    localStorage.setItem('emailNotVerified', 'true');
    this.currentUserSubject.next(user);               // réveil du navbar
  }


  notifyEmailVerified()    { this._emailVerified$.next(true); }
  hasUnverifiedMail(): boolean {
    return localStorage.getItem('emailNotVerified')=== 'true';
  }

  private startTokenRefreshTimer() {
    if (!this.isLoggedIn()) return;

    // Set timer to refresh token before it expires
    const token = this.getToken();
    const jwt = this.parseJwt(token);
    const expires = new Date(jwt.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }
  private stopTokenRefreshTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {}).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private parseJwt(token: any): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

/*
   processSocialLogin(user: SocialUser): void {
    // Send the token to your backend for verification and JWT generation
    this.http.post<any>(`${this.apiUrl}/auth/oauth2/login`, {
      provider: user.provider.toLowerCase(),
      token: user.idToken || user.authToken, // Use idToken for Google, authToken for Facebook
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl
    }).subscribe({
      next: (response) => {
        this.handleAuthSuccess(response);
      },
      error: (error) => {
        console.error('OAuth2 login error', error);
      }
    });
  }*/
    processSocialLogin(user: SocialUser): void {
      // Determine the correct endpoint based on the provider
      let endpoint = '';
      if (user.provider.toLowerCase() === 'facebook') {
        endpoint = `${this.apiUrl}/auth/oauth2/facebook`;
      } else if (user.provider.toLowerCase() === 'google') {
        endpoint = `${this.apiUrl}/auth/oauth2/google`;
      } else {
        endpoint = `${this.apiUrl}/auth/oauth2/login`; // fallback
      }

      // Send the token to your backend
      this.http.post<any>(endpoint, {
        provider: user.provider.toLowerCase(),
        token: user.idToken || user.authToken, // Use idToken for Google, authToken for Facebook
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl
      }).subscribe({
        next: (response) => {
          this.handleAuthSuccess(response);
        },
        error: (error) => {
          console.error('OAuth2 login error', error);
        }
      });
    }

  initializeGoogleSignIn(buttonId: string): void {
    // Make sure Google libraries are loaded
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      console.log("Intializing google sign-in with button Id:",buttonId);
      const buttonElement = document.getElementById(buttonId);

    if (!buttonElement) {
      console.error(`Button element with ID ${buttonId} not found`);
      return;
    }

      google.accounts.id.initialize({
        client_id: '278407912957-ja8f7vuh07kn8u9br218sds1p4fe10tb.apps.googleusercontent.com', // Replace with your actual client ID
        callback: this.handleGoogleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Render the button
      google.accounts.id.renderButton(
        document.getElementById(buttonId),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 240
        }
      );
      console.log("google sign-in button rendered");
    } else {
      console.error('Google accounts library not loaded');
    }
  }
  handleGoogleCredentialResponse(response: any): void {
    if (response.credential) {
      console.log("Received Google credential response:", response.credential.substring(0, 20) + "...");
      // Send the ID token to your backend
      console.log("Sending credential to backend:", {credential: response.credential});

      this.http.post<any>(`${this.apiUrl}/auth/oauth2/google`, {
        credential: response.credential
      }).subscribe({
        next: (backendResponse) => {
          console.log("Backend authentication successful",backendResponse);
          this.handleAuthSuccess(backendResponse);
        },
        error: (error) => {
          console.error('Error verifying Google credential with backend:', error);
        }
      });
    }
  }


  //hedha baathtou khater njareb fi solution okhra
  // Google login - using the SocialAuthService
  loginWithGoogle(): void {
    // The button is rendered by Google's SDK, so this is just a fallback
    // The actual authentication will happen through the authState subscription
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // Direct method to handle credential response from Google Sign-In Button
  handleGoogleCredential(credential: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/oauth2/google`, { credential }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
    .then(socialUser => {
      console.log('Facebook sign-in successful', socialUser);
      // The authState subscription should handle this
    })
    .catch(error => {
      console.error('Facebook sign-in error', error);
      // Handle error
    });
  }
  processFacebookLogin(socialUser: SocialUser): void {
    // Send Facebook token to your backend
    this.http.post<any>(`${this.apiUrl}/auth/oauth2/facebook`, {
      token: socialUser.authToken,
      email: socialUser.email,
      name: socialUser.name,
      photoUrl: socialUser.photoUrl
        }).subscribe({
      next: (response) => {
        this.handleAuthSuccess(response);
      },
      error: (error) => {
        console.error('Facebook login error', error);
      }
    });
  }
  // User authentication
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        // Add validation for the response structure
        if (!response || !response.token) {
          console.log('Invalid authentication response:', response);
          throw new Error('Invalid authentication response: Missing token');
        }

        // Enhanced logging for debugging
        console.log('Login successful - User data:', {
          id: response.id,
          email: response.email,
          role: response.role
        });

        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        // Enhanced error logging
        console.error('Login error details:', {
          status: error.status,
          message: error.message,
          url: error.url,
          error: error.error
        });

        // Rethrow with more context
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            const errorMsg = error.error?.error || '';

      if (errorMsg.includes('banned')) {
        throw new Error('Your account is banned. Please contact support.');
      }
      if (errorMsg.includes('inactive')) {
        throw new Error('Your account is inactive. Please contact support.');
      }


          throw new Error('Invalid email or password');
          } else if (error.status === 0) {
            throw new Error('Unable to connect to server');
          }
        }
        throw error;
      })
    );
  }
  // User profile update
  updateCurrentUser(userData: any): void {
    if (!userData) return;

    const currentData = this.getCurrentUser() || {};
    const mergedData = { ...currentData, ...userData };

    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(mergedData));
    this.currentUserSubject.next(mergedData);
  }
  // User registration with profile picture upload
  register(userData: any): Observable<any> {
    const formData = new FormData();
    console.log('Registering user with API URL:', `${this.apiUrl}/auth/register`);

    Object.keys(userData).forEach(key => {
      if (key !== 'photoDeProfil' && key !== 'recaptchaToken' || userData[key] === null) {
        formData.append(key, userData[key]);
      }
    });

    if (userData.photoDeProfil) {
      formData.append('photoDeProfil', userData.photoDeProfil, userData.photoDeProfil.name);
    }


    return this.http.post<any>(`${this.apiUrl}/auth/register`, formData).pipe(
      //tap(response => {
      //  if (response.token) {
      //    this.storeToken(response.token);
      //  }
      //}),
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


  // Method to validate token on app startup
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.get<any>(`${this.apiUrl}/auth/validate`).pipe(
      map(response => {
        if (response.valid) {
          return true;
        } else {
          this.clearAuthData();
          return false;
        }
      }),
      catchError(() => {
        this.clearAuthData();
        return of(false);
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
   handleAuthSuccess(response: LoginResponse): void {
    // Basic validation
    if (!response) {
    throw new Error('Empty authentication response');
   }

  // Ensure we have at least a token
  if (!response?.token) {
    console.error('Invalid auth response:', response);
    throw new Error('Invalid authentication response');
  }


    const userData = {
      ...response,
      token:response.token,
      id: response.id || 0, // Default ID if missing
      email: response.email || 'unknown@example.com', // Default email
      role: response.role || 'USER', // Default role
      username: response.username || response.email?.split('@')[0] || 'user',
      emailVerified: response.emailVerified || false // AJOUT
      // Default username      // Include any additional user data
    };

    localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    this.currentUserSubject.next(userData);
    console.log('Use Authenticated:', userData);
    this.startTokenRefreshTimer();


    this.redirectAfterLogin();
  }

  // Redirect after successful login
  private redirectAfterLogin(): void {
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectUrl');
      this.ngZone.run(()=>{
        this.router.navigateByUrl(redirectUrl);

      });
    } else {
      this.redirectBasedOnRole(this.currentUserSubject.value?.role);
    }
  }

   redirectBasedOnRole(role: string): void {
    this.ngZone.run(()=>
    {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }});
  }

  storeRedirectUrl(url: string): void {
    if (!url.includes('/login') && !url.includes('/verify-email')) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }
  // Load user data from storage on app initialization
   loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
  get user$() { return this.currentUser$; }

  //  Getcurrent user information
  getCurrentUser(): any {
    /*const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;*/
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data', e);
      this.clearAuthData();
      return null;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUserProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/auth/me`, { headers }).pipe(
      tap(user => {
        this.updateCurrentUser(user);
      }),
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          this.clearAuthData();
        }
        return throwError(() => error);
      })
    );
  }

  // Get user ID
  getUserId(): number | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    //ancienne implementation
    //return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
    /*const token = this.getToken();
    const user = this.getCurrentUser();
    console.log('Authentication check - Token:', !!token, 'User:', !!user);
    return !!token && !!user;*/
    return !!this.getCurrentUser();
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  deleteOwnAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/auth/users/${id}`);
  }
  // User logout
  logout(): void {

    this.socialAuthService.signOut().catch(() => {
      console.log('Social provider already signed out');
    });
    this.stopTokenRefreshTimer();
    this.clearAuthData();
this.ngZone.run(()=>{
    this.router.navigate(['/login']);
  });
}

}

// Response interface for login
interface LoginResponse {
  token: string;
  id: number;
  email: string;
  role: string;
  username?: string;
  name?: string;
  emailVerified?: boolean; // AJOUT
  [key: string]: any;
}
