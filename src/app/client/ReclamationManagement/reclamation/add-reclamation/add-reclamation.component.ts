import { Component } from '@angular/core';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css']
})
export class AddReclamationComponent {
  reclamation: Reclamation = {
    titreReclamation: '',
    descriptionReclamation: '',
    etatReclamation: 'NONAFFECTEE',
    dateCreation: new Date(),
    user: { idUser: 1 } // à adapter selon ton système d'authentification
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  captchaToken: string = ''
  captchaError: boolean = false;

  onCaptchaResolved(captchaResponse: string | null) {
    if (captchaResponse) {
      this.captchaToken = captchaResponse;  // Stocke le token
      this.captchaError = false; // Aucune erreur liée au captcha
    } else {
      this.captchaToken = '';  // Vide le token si l'utilisateur n'a pas résolu le CAPTCHA
      this.captchaError = true;
    }
  }
  constructor(
    private reclamationService: ReclamationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private toastr: ToastrService,
    private router: Router ,
    private authService : AuthService//user
  ) {}


  checkIfUrgent(): void {
    const urgentKeywords = ['scam', 'fraud', 'lost package', 'refund'];
    const title = this.reclamation.titreReclamation?.toLowerCase() || '';
    const description = this.reclamation.descriptionReclamation?.toLowerCase() || '';

    const isUrgent = urgentKeywords.some(keyword =>
      title.includes(keyword) || description.includes(keyword)
    );

    // Cast explicite vers les valeurs autorisées
    this.reclamation.etatReclamation = isUrgent ? 'URGENT' : 'NONAFFECTEE';
    console.log('État assigné :', this.reclamation.etatReclamation); // Debug
  }



  addReclamation(form: NgForm): void {
    this.checkIfUrgent();
    console.log('État après vérification:', this.reclamation.etatReclamation);
    if (!this.reclamation.titreReclamation?.trim() || !this.reclamation.descriptionReclamation?.trim()) {
      this.toastr.warning('Le titre et la description sont obligatoires et ne peuvent pas être vides', 'Champs requis');
      return;
    }
    if (!this.captchaToken) {
      this.toastr.warning('Veuillez compléter la vérification CAPTCHA', 'Vérification de sécurité');
      return;
    }
    this.isLoading = true;
    const payload: Reclamation = {
      titreReclamation: this.reclamation.titreReclamation.trim(),
      descriptionReclamation: this.reclamation.descriptionReclamation.trim(),
      etatReclamation: this.reclamation.etatReclamation,
      dateCreation: new Date(),
      user: { idUser: 1 }
    };

    this.reclamationService.addReclamation(payload).subscribe({
      next: (newReclamation) => {
        this.toastr.success('Votre réclamation a été enregistrée avec succès (Statut: ' + payload.etatReclamation + ')', 'Succès');

        this.router.navigate(['/claim']);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.toastr.error(
          err.error?.message || 'Une erreur est survenue lors de l\'envoi de votre réclamation',
          'Erreur'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


}
