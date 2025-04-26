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
    this.fetchProfileFromCurrentUser();
   }

   private fetchProfileFromCurrentUser(): void {
    this.authService.currentUser$
    .subscribe(u => {
      if (!u?.email) {
        this.showError('Utilisateur inconnu');
        this.loading = false;
        return;
      }
      this.fetchProfile(u.email);          // <-- e-mail
    });
  }
  
   private fetchProfile(email: string): void {
    this.loading = true;

  this.http.get<any>(`/api/users/${encodeURIComponent(email)}`)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next : data  => this.fillForm(data),
      error: ()    => this.showError('Failed to load user profile')
    });
  }

  private fillForm(userData: any) {
    this.user = userData;                            // avatar + nom
  
    const formValues = {
      nom         : userData.nom         ?? '',
      prenom      : userData.prenom      ?? '',
      email       : userData.email       ?? '',
      username    : userData.username    ?? '',
      numTelephone: userData.numTelephone?? '',
      adresse     : userData.adresse     ?? ''
    };
  
    this.profileForm.patchValue(formValues);
    this.originalFormValues = { ...formValues };
  
    if (userData.photoDeProfil) {
      this.imagePreview = 'data:image/jpeg;base64,' + userData.photoDeProfil;
    }
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
    if (!this.isFormChanged() && !this.uploadedImage) {
      this.showError('No changes were made to save');
      return;
    }
  
    const id = this.user.id;                       // ⭐ récupéré du DTO
    if (!id) { this.showError('Utilisateur inconnu'); return; }
  
    this.isSubmitting = true;
  
    const formData = new FormData();
    const current  = this.profileForm.getRawValue();
  
    Object.keys(current).forEach(k => {
      if (current[k] !== this.originalFormValues[k]) {
        formData.append(k, current[k]);
      }
    });
    if (this.uploadedImage) {
      formData.append('photoDeProfil', this.uploadedImage, this.uploadedImage.name);
    }
  
    this.http.put(`/api/auth/update/${id}`, formData)
             .pipe(finalize(() => (this.isSubmitting = false)))
             .subscribe({
               next : (res: any) => {
                 this.showSuccess('Profile updated successfully');
                 this.originalFormValues = { ...current };
                 this.authService.updateCurrentUser(res.user);  // maj localStorage / navbar
               },
               error: () => this.showError('Failed to update profile')
             });
  }
  

  // Vérifier si le formulaire a été modifié
  isFormChanged(): boolean {
    const currentValues = this.profileForm.value;
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