import { Component, OnInit, AfterViewInit, ViewEncapsulation,ViewChild, ElementRef } from '@angular/core';
import { DemandeRecyclageService } from '../../services/demande-recyclage/demande-recyclage.service';
import { NgForm } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-demande-recycle',
  templateUrl: './demande-recycle.component.html',
  styleUrls: ['./demande-recycle.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DemandeRecycleComponent implements OnInit, AfterViewInit {
  demandes: any[] = [];
  demande: any = {
    idDemandeRecyclage: null,
    dateCreationDemandeRecyclage: '',
    descriptionDemandeRecyclage: '',
    nbrAppareils: 0,
    etatDemandeRecyclage: 'NONAFFECTEE',
    prixDemandeRecyclage: 0
  };

  originalDemande: any;
  isEditMode = false;
  modal: any;
  wasSubmitted = false;
  imageChanged = false;
  imageLabel = 'Choisir une image';
  today = new Date().toISOString().split('T')[0];

  constructor(private demandeService: DemandeRecyclageService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  loadDemandes(): void {
    this.demandeService.getAll().subscribe(data => this.demandes = data);
  }

  saveOrUpdate(form: NgForm): void {
    this.wasSubmitted = true;

    if (!form.valid || !this.validateForm()) {
      return;
    }

    if (this.isEditMode) {
      const currentDemande = { ...this.demande };
      delete currentDemande.imageData;

      const original = { ...this.originalDemande };
      delete original.imageData;

      if (JSON.stringify(currentDemande) === JSON.stringify(original) && !this.imageChanged) {
        alert('Aucune modification détectée.');
        return;
      }

      this.update();
    } else {
      this.save();
    }
  }

  validateForm(): boolean {
    const desc = this.demande.descriptionDemandeRecyclage;
    const date = this.demande.dateCreationDemandeRecyclage;
    return (
      desc && desc.trim().length >= 15 &&
      date && date < this.today &&
      this.demande.nbrAppareils > 0 &&
      this.demande.prixDemandeRecyclage > 0 &&
      (this.demande.imageData || this.isEditMode)
    );
  }

  save(): void {
    const formData = new FormData();
    const demandeSansImage = { ...this.demande };
    delete demandeSansImage.imageData;

    formData.append('demande', JSON.stringify(demandeSansImage));
    if (this.demande.imageData) {
      formData.append('file', this.dataURItoBlob(this.demande.imageData), 'image.png');
    }

    this.demandeService.save(formData).subscribe(() => {
      this.loadDemandes();
      this.resetForm();
      if (this.modal) this.modal.hide();
    });
  }

  update(): void {
    const formData = new FormData();
    const demandeSansImage = { ...this.demande };
    delete demandeSansImage.imageData;

    formData.append('demande', JSON.stringify(demandeSansImage));

    if (this.imageChanged && this.demande.imageData) {
      formData.append('file', this.dataURItoBlob(this.demande.imageData), 'image.png');
    }

    this.demandeService.update(formData).subscribe(() => {
      this.loadDemandes();
      this.resetForm();
      if (this.modal) this.modal.hide();
    });
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  edit(d: any): void {
    this.demande = { ...d };
    if (d.dateCreationDemandeRecyclage) {
      const dt = new Date(d.dateCreationDemandeRecyclage);
      this.demande.dateCreationDemandeRecyclage = dt.toISOString().substring(0, 10);
    }
    this.originalDemande = JSON.parse(JSON.stringify(this.demande));
    this.demande.imageData = 'data:image/png;base64,' + d.imageBase64;

    this.isEditMode = true;
    this.imageChanged = false;

    // ← reset the file picker and its label
    this.fileInput.nativeElement.value = '';
    this.imageLabel = 'Choisir une image';

    this.openModal();
  }

  delete(id: number): void {
    this.demandeService.remove(id).subscribe(() => this.loadDemandes());
  }

  resetForm(): void {
    this.demande = {
      idDemandeRecyclage: null,
      dateCreationDemandeRecyclage: '',
      descriptionDemandeRecyclage: '',
      nbrAppareils: 0,
      etatDemandeRecyclage: 'NONAFFECTEE',
      prixDemandeRecyclage: 0
    };
    this.wasSubmitted = false;
    this.imageChanged = false;
    this.isEditMode = false;
    this.imageLabel = 'Choisir une image';
  }

  openModal(): void {
    if (this.modal) this.modal.show();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const maxSizeMB = 100;

    if (file && file.size > maxSizeMB * 1024 * 1024) {
      alert(`Le fichier dépasse la taille maximale autorisée (${maxSizeMB}MB).`);
      return;
    }

    if (file) {
      this.imageLabel = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.demande.imageData = reader.result as string;
        this.imageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: 'image/png' });
  }
}
