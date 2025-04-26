import { AvisService } from './../services/avis.service';
import { Component, OnInit } from '@angular/core';
import { Avis } from '../model/avis';
import { Router, ActivatedRoute } from '@angular/router';
import { AppareilService } from '../services/appareil.service';
import { Appareil } from '../model/appareil';
import { EtatAppareilEnum } from '../model/etat-appareil.enum';
@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {
  avisList: Avis[] = [];
  currentAvis: Avis = {
    contenu: '',
    appareil: {
      idAppareil: 0,
      nom: '',
      categorie: '',
      prix: 0,
      description: '',
      imageurl: '',
      etatAppareil: EtatAppareilEnum.NEUF, // Adjust enum or string values as per your requirement
      marque: '',
      avis: []
    },
    user: {
      idUser: 0,
      nom: '',
      email: '',
      username: '',
      prenom: '',
      numTelephone: 0,
      dateNaissance: undefined,
      adresse: '',
      role: 0,
      password: '',
      photoDeProfil: ''
    }
  };

  isEditMode: boolean = false;
  appareils!: Appareil[];

  constructor(
    private avisService: AvisService,
    private router: Router,
    private route: ActivatedRoute,
    private appareilService: AppareilService
  ) {}

  ngOnInit(): void {
    this.loadAvis();
    this.loadAppareils();
  }

  loadAppareils(): void {
    this.appareilService.getAppareils().subscribe(data => this.appareils = data);
  }

  loadAvis(): void {
    this.avisService.getAllAvis().subscribe((data: Avis[]) => {
      console.log('Avis récupérés:', data);
      this.avisList = data;
    });
  }


  loadAvisById(id: number): void {
    this.avisService.getAvisById(id).subscribe((data: Avis) => {
      this.currentAvis = data; // Dynamically load Avis by its ID
      this.isEditMode = true;
    });
  }

  updateAvis(): void {
    if (this.currentAvis.idAvis !== undefined) {
      this.avisService.updateAvis(this.currentAvis.idAvis, this.currentAvis).subscribe(
        () => {
          this.loadAvis(); // Reload the list of avis after update
          this.isEditMode = false;
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'avis', error);
        }
      );
    }
  }

  deleteAvis(idAvis: number | undefined): void {
    if (idAvis === undefined) {
      console.error('Avis ID is undefined');
      return;
    }

    this.avisService.deleteAvis(idAvis).subscribe(() => {
      this.avisList = this.avisList.filter(a => a.idAvis !== idAvis);
    });
  }


  resetForm(): void {
    this.currentAvis = {
      contenu: '',
      appareil: {
        idAppareil: 0,
        nom: '',
        categorie: '',
        prix: 0,
        description: '',
        imageurl: '',
        etatAppareil: EtatAppareilEnum.NEUF, // Adjust enum or string values as per your requirement
        marque: '',
        avis: []
      },
      user: {
        idUser: 0,
        nom: '',
        email: '',
        username: '',
        prenom: '',
        numTelephone: 0,
        dateNaissance: undefined,
        adresse: '',
        role: 0,
        password: '',
        photoDeProfil: ''
      }
    };
  }
}
