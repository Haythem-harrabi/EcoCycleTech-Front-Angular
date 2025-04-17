import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isVerified = false;
  errorMessage: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verificationService: VerificationService
  ) { }

  ngOnInit(): void {
    // Get token from URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        this.verifyToken(token);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Verification token is missing.';
      }
    });
  }

  private verifyToken(token: string): void {
    this.verificationService.verifyEmail(token).subscribe({
      next: (response) => {
        this.isVerified = true;
        this.isLoading = false;
        // Optional: Redirect to login page after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to verify email. The token may be invalid or expired.';
      }
    });
  }

  // Navigate to login page
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Optional: Resend verification email
  resendVerification(email: string): void {
    if (!email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }
    
    this.isLoading = true;
    this.verificationService.resendVerificationEmail(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = null;
        // Show success message (you might want to implement a toast notification)
        alert('Verification email has been resent. Please check your inbox.');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to resend verification email.';
      }
    });
  }
}