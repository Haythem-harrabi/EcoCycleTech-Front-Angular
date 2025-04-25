import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = {};
  loading = true;
  isSubmitting = false;
  uploadedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  updateSuccess = false;
  updateError = false;
  errorMessage = '';
  originalFormValues: any = {}; // Pour stocker les valeurs initiales

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    // private toastr: ToastrService // Décommentez si vous utilisez Toastr
  ) {
    this.profileForm = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      numTelephone: [''],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.showError('User not authenticated');
      this.loading = false;
      return;
    }

    this.http.get<any>(`/api/auth/fetch/${userId}`).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (userData) => {
        this.user = userData;
        
        // Mettre à jour le formulaire avec les données de l'utilisateur
        const formValues = {
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          username: userData.username || '',
          numTelephone: userData.numTelephone || '',
          adresse: userData.adresse || ''
        };
        
        this.profileForm.patchValue(formValues);
        
        // Stocker les valeurs originales pour comparaison ultérieure
        this.originalFormValues = { ...formValues };

        if (userData.photoDeProfil) {
          this.imagePreview = 'data:image/jpeg;base64,' + userData.photoDeProfil;
        }
      },
      error: (error) => {
        console.error('Failed to load user profile', error);
        this.showError('Failed to load user profile');
      }
    });
  }

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.includes('image/')) {
          this.showError('Please select an image file');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showError('Image size should be less than 5MB');
          return;
        }
        
        this.uploadedImage = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  updateProfile(): void {
    // Vérifier si le formulaire a été modifié
    if (!this.isFormChanged() && !this.uploadedImage) {
      this.showError('No changes were made to save');
      return;
    }

    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.showError('User not authenticated');
      return;
    }

    this.isSubmitting = true;
    this.updateSuccess = false;
    this.updateError = false;

    const formData = new FormData();
    const formValues = this.profileForm.getRawValue();
    
    // N'inclure que les champs qui ont été modifiés
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined && 
          formValues[key] !== this.originalFormValues[key]) {
        formData.append(key, formValues[key]);
      }
    });

    if (this.uploadedImage) {
      formData.append('photoDeProfil', this.uploadedImage, this.uploadedImage.name);
    }

    this.http.put<any>(`/api/auth/update/${userId}`, formData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (response) => {
        this.showSuccess('Profile updated successfully');
        
        // Mettre à jour les valeurs originales avec les nouvelles valeurs
        this.originalFormValues = { ...formValues };
        
        // Update user data in local storage if needed
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.nom = formValues.nom;
          currentUser.prenom = formValues.prenom;
          this.authService.updateCurrentUser(currentUser);
        }
      },
      error: (error) => {
        console.error('Failed to update profile', error);
        this.showError(error.error?.message || 'Failed to update profile');
      }
    });
  }

  // Vérifier si le formulaire a été modifié
  isFormChanged(): boolean {
    const currentValues = this.profileForm.getRawValue();
    return Object.keys(currentValues).some(key => 
      currentValues[key] !== this.originalFormValues[key]
    );
  }

  private showSuccess(message: string): void {
    this.updateSuccess = true;
    // Si vous utilisez Toastr
    // this.toastr.success(message);
    setTimeout(() => this.updateSuccess = false, 5000); // Hide after 5 seconds
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.updateError = true;
    // Si vous utilisez Toastr
    // this.toastr.error(message);
    setTimeout(() => this.updateError = false, 5000); // Hide after 5 seconds
  }
}