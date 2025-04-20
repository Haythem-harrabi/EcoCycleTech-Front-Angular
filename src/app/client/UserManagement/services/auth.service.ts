import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
declare var google: any;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api';
    private readonly AUTH_TOKEN_KEY = 'auth_token';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.loadUserFromStorage();
    
    // Subscribe to social auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.processSocialLogin(user);
      }
    });
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
  register(userData: any): Observable<any> {
    const formData = new FormData();
    
    Object.keys(userData).forEach(key => {
      if (key !== 'photoDeProfil' && key !== 'recaptchaToken' || userData[key] === null) {
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
   handleAuthSuccess(response: LoginResponse): void {
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
   redirectBasedOnRole(role: string): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Load user data from storage on app initialization
   loadUserFromStorage(): void {
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
    this.socialAuthService.signOut().catch(() => {
      console.log('Not logged in with social provider or already signed out');
    });
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