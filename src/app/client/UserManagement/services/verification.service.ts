import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify?token=${encodeURIComponent(token)}`);
  }
  
  // Optional: Method to resend verification email
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/resend-verification`, { email });
  }
}