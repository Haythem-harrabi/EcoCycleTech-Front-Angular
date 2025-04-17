import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  activeTab: 'signin' | 'signup' | 'forgot' = 'signin';
  
  // Login form
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  
  // Signup form
  signupForm: FormGroup;
  isSignupLoading = false;
  signupErrorMessage = '';
  showSignupPassword = false;
  selectedFileName = '';
  selectedFile: File | null = null;
  
  // Forgot password form
  forgotPasswordForm: FormGroup;
  otpVerificationForm: FormGroup;
  newPasswordForm: FormGroup;
  isForgotPasswordLoading = false;
  forgotPasswordError = '';
  forgotPasswordSuccess = '';
  forgotPasswordStep: 'email' | 'otp' | 'newPassword' = 'email';
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize forms
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      numTelephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      dateNaissance: ['', [Validators.required, this.ageValidator(12)]],
      adresse: ['', Validators.required],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required],
      photoDeProfil: ['',Validators.required],
      recaptcha: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpVerificationForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }
  ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const birthDate = new Date(control.value);
      const today = new Date();
      
      // Calculer la différence en années
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Vérifier si l'âge est supérieur ou égal à l'âge minimum
      return age < minAge ? { 'minAge': { requiredAge: minAge, actualAge: age } } : null;
    };
  }
  // Add this method to your component class
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    
    if (!value) {
      return null;
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    
    // Retourner des erreurs spécifiques pour chaque critère non satisfait
    const errors: any = {};
    let hasError = false;
    
    if (!hasUpperCase) {
      errors.noUpperCase = true;
      hasError = true;
    }
    
    if (!hasLowerCase) {
      errors.noLowerCase = true;
      hasError = true;
    }
    
    if (!hasNumeric) {
      errors.noNumeric = true;
      hasError = true;
    }
    
    if (!hasSpecialChar) {
      errors.noSpecialChar = true;
      hasError = true;
    }
    
    return hasError ? errors : null;
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Tab switching
  switchTab(tab: 'signin' | 'signup' | 'forgot'): void {
    this.activeTab = tab;
    this.resetMessages();
    if (tab === 'forgot') {
      this.forgotPasswordStep = 'email';
    }
  }

  // Reset error/success messages
  resetMessages(): void {
    this.errorMessage = '';
    this.signupErrorMessage = '';
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = '';
  }

  // Toggle password visibility for login
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Toggle password visibility for signup
  toggleSignupPasswordVisibility(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  // Show forgot password form
  showForgotPasswordForm(): void {
    this.switchTab('forgot');
  }

  // Handle file selection for profile picture
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  // Login form submission
  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirection handled by the auth service
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion:', err);
      }
    });
  }

  // Signup form submission
  // In login.component.ts
  /*onSignupSubmit(): void {
    if (this.signupForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher toutes les erreurs
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
  
    this.isSignupLoading = true;
    this.signupErrorMessage = '';
  
    const signupData = {
      ...this.signupForm.value,
      photoDeProfil: this.selectedFile
    };
    delete signupData.confirmPassword;
  
    this.authService.register(signupData).subscribe({
      next: (response) => {
        this.isSignupLoading = false;
        // Auto-login est géré par le service d'authentification
      },
      error: (err) => {
        this.isSignupLoading = false;
        
        // Gestion d'erreur améliorée avec des messages spécifiques
        if (err.status === 400) {
          if (err.error.field === 'both') {
            this.signupErrorMessage = 'L\'email et le nom d\'utilisateur sont déjà pris.';
          } else if (err.error.field === 'email') {
            this.signupErrorMessage = 'Cet email est déjà utilisé.';
          } else if (err.error.field === 'username') {
            this.signupErrorMessage = 'Ce nom d\'utilisateur est déjà pris.';
          } else {
            this.signupErrorMessage = err.error.message || 'Erreur lors de l\'inscription.';
          }
        } else {
          this.signupErrorMessage = 'Erreur serveur. Veuillez réessayer.';
        }
        console.error('Erreur d\'inscription:', err);
      }
    });
  }*/
    onSignupSubmit(): void {
      // Validation du formulaire
      if (this.signupForm.invalid) {
        this.markAllFormControlsAsTouched();
        return;
      }
    
      this.isSignupLoading = true;
      this.signupErrorMessage = '';
    
      // Préparation des données
      const userData = {
        ...this.signupForm.value,
        photoDeProfil: this.selectedFile,
        dateNaissance: this.formatDateForBackend(this.signupForm.get('dateNaissance')?.value),
        recaptchaToken: this.signupForm.get('recaptcha')?.value
      };
      delete userData.confirmPassword;
    
      // Appel du service
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.handleRegistrationSuccess(response);
        },
        error: (err) => {
          this.handleRegistrationError(err);
          this.signupForm.get('recaptcha')?.reset();
        }
      });
    }
    
    // --- Fonctions utilitaires ---
    
    private markAllFormControlsAsTouched(): void {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
    
    private formatDateForBackend(date: string | Date): string {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }
    
    private handleRegistrationSuccess(response: any): void {
      this.isSignupLoading = false;
      
      // Gestion de la réponse réussie
      if (response.token) {
        this.authService.storeToken(response.token);
        this.router.navigate(['/']);
      } else {
        // Redirection vers la page de vérification si nécessaire
        this.router.navigate(['/verify-email']);
      }
    }
    
    private handleRegistrationError(err: any): void {
      this.isSignupLoading = false;
      
      // Gestion des erreurs structurée
      if (err.status === 0) {
        this.signupErrorMessage = 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.';
        return;
      }
    
      if (err.error) {
        // Erreurs spécifiques du backend
        if (err.error.field) {
          this.handleFieldSpecificErrors(err.error);
        } else if (err.error.message) {
          this.signupErrorMessage = err.error.message;
        } else {
          this.signupErrorMessage = 'Erreur lors de l\'inscription. Code: ' + err.status;
        }
      } else {
        this.signupErrorMessage = 'Une erreur inattendue est survenue.';
      }
    
      console.error('Détails de l\'erreur:', err);
    }
    
    private handleFieldSpecificErrors(error: { field: string, message?: string }): void {
      switch (error.field) {
        case 'both':
          this.signupErrorMessage = 'L\'email et le nom d\'utilisateur sont déjà utilisés.';
          this.signupForm.get('email')?.setErrors({ taken: true });
          this.signupForm.get('username')?.setErrors({ taken: true });
          break;
        case 'email':
          this.signupErrorMessage = error.message || 'Cet email est déjà utilisé.';
          this.signupForm.get('email')?.setErrors({ taken: true });
          break;
        case 'username':
          this.signupErrorMessage = error.message || 'Ce nom d\'utilisateur est déjà pris.';
          this.signupForm.get('username')?.setErrors({ taken: true });
          break;
        default:
          this.signupErrorMessage = error.message || 'Erreur de validation';
      }
    }
  getPasswordStrength(): number {
    const password = this.signupForm.get('password')?.value || '';
    if (!password) return 0;
    
    let strength = 0;
    
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) strength++;
    
    return strength;
  }
  
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Non renseigné';
      case 1: return 'Très faible';
      case 2: return 'Faible';
      case 3: return 'Moyen';
      case 4: return 'Fort';
      default: return '';
    }
  }

  // Step 1: Request OTP for password reset
  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;
  
    this.isForgotPasswordLoading = true;
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = '';
  
    const { email } = this.forgotPasswordForm.value;
    this.userEmail = email; // Store email for later steps
  
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordSuccess = 'Un code OTP a été envoyé à votre adresse email.';
        this.forgotPasswordStep = 'otp';
      },
      error: (err) => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordError = 'Erreur lors de l\'envoi de l\'OTP. Veuillez réessayer.';
        console.error('Erreur d\'envoi d\'OTP:', err);
      }
    });
  }

  // Step 2: Verify OTP
  onVerifyOtpSubmit(): void {
    if (this.otpVerificationForm.invalid) return;

    this.isForgotPasswordLoading = true;
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = '';

    const { otp } = this.otpVerificationForm.value;

    this.authService.verifyOtp(otp, this.userEmail).subscribe({
      next: () => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordSuccess = 'OTP vérifié avec succès. Veuillez définir un nouveau mot de passe.';
        this.forgotPasswordStep = 'newPassword';
      },
      error: (err) => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordError = 'Code OTP invalide ou expiré. Veuillez réessayer.';
        console.error('Erreur de vérification d\'OTP:', err);
      }
    });
  }

  // Step 3: Set new password
  onNewPasswordSubmit(): void {
    if (this.newPasswordForm.invalid) return;

    this.isForgotPasswordLoading = true;
    this.forgotPasswordError = '';
    this.forgotPasswordSuccess = '';

    const { password, confirmPassword } = this.newPasswordForm.value;

    this.authService.changePassword(this.userEmail, password, confirmPassword).subscribe({
      next: () => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordSuccess = 'Votre mot de passe a été réinitialisé avec succès.';
        setTimeout(() => {
          this.switchTab('signin');
        }, 2000);
      },
      error: (err) => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordError = 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.';
        console.error('Erreur de changement de mot de passe:', err);
      }
    });
  }
  
}