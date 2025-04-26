import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) { }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email`, {
      params: { token }                              // 2. envoie « token »
    });


  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
      return throwError(() => 'Network error occurred');
    } else {
      // Server-side error
      console.error(`Backend returned ${error.status}: ${error.error}`);
      
      // Handle HTML responses
      if (error.headers.get('content-type')?.includes('text/html')) {
        return throwError(() => 'Server error occurred');
      }
      
      return throwError(() => error.error?.message || 'Unknown server error');
    }
  }
  
  // Optional: Method to resend verification email
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }
}