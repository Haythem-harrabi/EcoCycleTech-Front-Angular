import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationService } from '../services/verification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';
import { NotificationKey } from '../services/notification.service';   // <-- ajoute

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isVerified = false;
  errorMessage: string | null = null;
  email: string | null = null; // For resend functionality  
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verificationService: VerificationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private notif:NotificationService

  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.errorMessage = 'Token manquant dans l URL.';
      this.isLoading = false;
      return;
    }
  
    this.verifyToken(token);
  }
  

  private verifyToken(token: string): void {
    this.verificationService.verifyEmail(token).subscribe({
      next: _ => {
        /* 1. marque la vérification réussie */
        this.isVerified = true;
  
        /* 2. on retire le drapeau et la pastille ----------------- */
        localStorage.removeItem('emailNotVerified');          // ancien drapeau (string)
        this.notif.remove('EMAIL_NOT_VERIFIED' as NotificationKey); // pastille navbar
  
        /* 3. on informe les autres composants éventuels ---------- */
        this.authService.notifyEmailVerified();
  
        /* 4. toast ----------------------------------------------- */
        this.snackBar.open('E-mail vérifié ! Bienvenue 👌', '', { duration: 4000 });
  
        /* 5. retour à l’accueil ---------------------------------- */
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
  
      error: (err: HttpErrorResponse) => {
        // ❯❯ pick the most useful message the backend sent
        this.errorMessage =
          err.error?.error ||    // our JSON `{ error:"…" }`
          err.error?.message ||  // fallback
          err.message;           // network / unknown
  
        this.isLoading = false;
        console.error('Verification failed :', err);
      }
    });
  }
  
  private handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    console.error('Verification error:', message);
  }

  // Navigate to login page
  goToLogin(): void {
    setTimeout(() => 
    this.router.navigate(['/login']),15000);
    
  }

  // Optional: Resend verification email
  resendVerification(email: string): void {
    if (!this.email) {
      this.errorMessage = 'No email available for resending.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    this.verificationService.resendVerificationEmail(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        // Show success message
        this.errorMessage = 'New verification email sent! Check your inbox.';
      },
      error: (error) => {
        this.handleError(
          error.error?.message ||
          'Failed to resend verification email. Please try again later.'
        );
      }
    });
  }
}