import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Appareil } from '../model/appareil';
import { ActivatedRoute, Router } from '@angular/router';
import { AppareilService } from '../services/appareil.service';
import { EtatAppareilEnum } from '../model/etat-appareil.enum';

@Component({
  selector: 'app-add-appareil',
  templateUrl: './add-appareil.component.html',
  styleUrls: ['./add-appareil.component.css']
})
export class AddAppareilComponent implements OnInit {
  AppareilForm: FormGroup;
  idAppareil!: number;
  appareil!: Appareil;
  etatAppareilOptions: string[] = Object.values(EtatAppareilEnum);
  prixPrevu?: number;
  errorMessage: string | undefined;

  // Add these properties for image upload
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  imageUploading = false;
  uploadSuccess = false;

  constructor(
    private appareilService: AppareilService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.AppareilForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      categorie: new FormControl('', Validators.required),
      etatAppareil: new FormControl('', Validators.required),
      marque: new FormControl('', Validators.required),
      imageurl: new FormControl('', [Validators.required]),
      prix: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.idAppareil = this.route.snapshot.params['id'];

    if (this.idAppareil) {
      this.appareilService.getAppareilById(this.idAppareil).subscribe(
        (data: Appareil) => {
          this.appareil = data;
          this.AppareilForm.patchValue(this.appareil);
        },
        (error) => {
          console.error('Erreur lors du chargement de l\'appareil', error);
        }
      );
    }
  }

  // Add this method to handle file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadSuccess = false;

    // Create image preview
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreview = null;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      return;
    }

    this.imageUploading = true;
    this.uploadSuccess = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.appareilService.uploadImage(formData).subscribe({
      next: (response: { imageUrl: string }) => {
        this.imageUploading = false;
        this.uploadSuccess = true;
        // Set the image URL returned from backend into the form control
        this.AppareilForm.get('imageurl')?.setValue(response.imageUrl);
      },
      error: (error: { message: string; }) => {
        this.imageUploading = false;
        console.error('Erreur lors du téléchargement de l\'image', error);
        this.errorMessage = 'Erreur lors du téléchargement de l\'image: ' + error.message;
      }
    });
  }

  save() {
    if (this.AppareilForm.invalid) {
      this.markFormGroupTouched(this.AppareilForm);
      return;
    }

    const formData = this.AppareilForm.value;

    if (this.idAppareil) {
      // Update existing device
      this.appareilService.updateAppareil(this.idAppareil, formData).subscribe({
        next: () => this.router.navigateByUrl('admin/Appareils'),
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour de l\'appareil : ' + (err.error?.message || err.statusText);
        }
      });
    } else {
      // Create new device
      this.appareilService.createAppareil(formData).subscribe({
        next: () => this.router.navigateByUrl('admin/Appareils'),
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création de l\'appareil : ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  onPredictPrix(): void {
    const description = this.AppareilForm.get('description')?.value;
    if (description && description.trim()) {
      this.appareilService.predictPrix(description).subscribe({
        next: (prix: number) => {
          this.prixPrevu = prix;
        },
        error: (err) => console.error('Erreur prédiction prix', err)
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
