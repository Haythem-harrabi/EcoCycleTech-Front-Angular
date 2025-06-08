import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../admin/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

type EtatReclamation = 'EN_ATTENTE' | 'TRAITEE' | 'REJETEE' | 'NONAFFECTEE'|'URGENT';
@Injectable({
  providedIn: 'root'
})

export class ReclamationService {
  private apiUrl = 'http://localhost:8082/ecoCycleTech/api/reclamations';

  private etatMapping: {[key in EtatReclamation]: number} = {
    'NONAFFECTEE': 0,
    'URGENT': 4,
    'EN_ATTENTE': 1,
    'TRAITEE': 2,
    'REJETEE': 3
  };

  // Mapping inverse (codes numériques vers états)
  private reverseEtatMapping: {[key: number]: EtatReclamation} = {
    0: 'NONAFFECTEE',
    1: 'EN_ATTENTE',
    2: 'TRAITEE',
    3: 'REJETEE',
    4: 'URGENT'
  };


   private mapEtatToBackend(etat: EtatReclamation): number {
    return this.etatMapping[etat] || 0;
  }


  private mapBackendToEtat(code: number): EtatReclamation {
    return this.reverseEtatMapping[code] || 'NONAFFECTEE';
  }

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<Reclamation> {
    return this.getReclamationById(id);
  }

  addReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.apiUrl, reclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateReclamation(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}`, reclamation);
  }

  checkIfTitleExists(titre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-title?title=${titre}`);
  }

  deleteReclamation(id: number): void {
    this.delete(id).subscribe({
      next: () => {
        this.toastr.success('Réclamation supprimée avec succès!', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la réclamation', err);
        this.toastr.error('Une erreur est survenue lors de la suppression', 'Erreur');
      }
    });



}

}
