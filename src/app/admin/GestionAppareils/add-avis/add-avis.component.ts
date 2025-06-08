import { Component, OnInit } from '@angular/core';
import { Avis } from '../model/avis';
import { Appareil } from '../model/appareil';
import { User } from '../../models/user';
import { AvisService } from '../services/avis.service';
import { AppareilService } from '../services/appareil.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BadWordsService } from '../services/bad-words.service';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';

@Component({
  selector: 'app-add-avis',
  templateUrl: './add-avis.component.html',
  styleUrls: ['./add-avis.component.css']
})
export class AddAvisComponent implements OnInit {
  avisList: Avis[] = [];
  AvisForm!: FormGroup;
  appareils: Appareil[] = [];
  users: User[] = [];
  idAvis!: number;
  isEditMode: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private avisService: AvisService,
    private appareilService: AppareilService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private badWordService: BadWordsService,
        private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.initForm();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.AvisForm.patchValue({
        user: currentUser.id, // Pre-fill user ID
      });
    } else {
      this.errorMessage = 'You must be logged in to create a reservation';
      this.route.navigate(['/login']);
    }
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.idAvis = +idParam;
      this.isEditMode = true;

      this.appareilService.getAppareils().subscribe(apps => {
        this.appareils = apps;
        this.loadAvisById(this.idAvis); // 👈 appelé uniquement après avoir les appareils
      });
    } else {
      this.loadAppareils();
    }
  }


  initForm(): void {
    this.AvisForm = this.fb.group({
      contenu: ['', Validators.required],
      appareil: [null, Validators.required],
      rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
      user: null
    });
  }

  loadAppareils(): void {
    this.appareilService.getAppareils().subscribe(data => this.appareils = data);
  }

  setRating(rating: number): void {
    this.AvisForm.get('rating')?.setValue(rating);
  }

  loadAvisById(idAvis: number): void {
    this.avisService.getAvisById(idAvis).subscribe(data => {
      const appareilMatched = this.appareils.find(app => app.idAppareil === data.appareil?.idAppareil);
      this.AvisForm.patchValue({
        contenu: data.contenu,
        appareil: appareilMatched,
        rating: data.rating,
        user: data.user
      });
    });
  }



  saveAvis(): void {
    const formValue = this.AvisForm.value;
    const filteredContent = this.badWordService.filter(formValue.contenu);
        const avisToSave = {
      contenu: filteredContent,
      rating: formValue.rating,
      appareil: { idAppareil: formValue.appareil.idAppareil }, // Send only ID
      user: { idUser: formValue.user?.idUser }
    };

    console.log('Avis à enregistrer:', avisToSave);

    if (this.isEditMode) {
      this.avisService.updateAvis(this.idAvis, avisToSave).subscribe({
        next: () => this.route.navigateByUrl('Avis'),
        error: err => console.error('Erreur lors de la modification de l avis', err)
      });
    } else {
      this.avisService.addAvis(avisToSave).subscribe({
        next: () => this.route.navigateByUrl('Avis'),
        error: err => console.error('Erreur lors de lajout de l avis', err)
      });
    }
  }
  resetForm(): void {
    this.AvisForm.reset();
    this.isEditMode = false;
  }
}
