import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportReclamation } from '../admin/models/support-reclamation.model';

@Injectable({
  providedIn: 'root'
})
export class SupportReclamationService {

  private baseUrl = 'http://localhost:8082/ecoCycleTech/api/support-reclamations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SupportReclamation[]> {
    return this.http.get<SupportReclamation[]>(this.baseUrl);
  }

  getById(id: number): Observable<SupportReclamation> {
    return this.http.get<SupportReclamation>(`${this.baseUrl}/${id}`);
  }

  create(supportReclamation: SupportReclamation): Observable<SupportReclamation> {
    return this.http.post<SupportReclamation>(this.baseUrl, supportReclamation);
  }

  update(id: number, supportReclamation: SupportReclamation): Observable<SupportReclamation> {
    return this.http.put<SupportReclamation>(`${this.baseUrl}/${id}`, supportReclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
