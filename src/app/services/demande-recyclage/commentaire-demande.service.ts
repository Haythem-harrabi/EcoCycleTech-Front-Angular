import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentaireDemande } from '../../entities/demanderecyclage/commentaire-demande.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireDemandeService {
  private apiUrl = 'http://localhost:8082/ecoCycleTech/commentaireDemande';

  constructor(private http: HttpClient) {}

  addComment(comment: CommentaireDemande): Observable<CommentaireDemande> {
    return this.http.post<CommentaireDemande>(`${this.apiUrl}/add`, comment);
  }

  getCommentsByDemandeId(demandeId: number): Observable<CommentaireDemande[]> {
    return this.http.get<CommentaireDemande[]>(`${this.apiUrl}/demande/${demandeId}`);
  }
deleteComment(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
}

  
}
