import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Collecte } from 'src/app/entities/pointDeVenteEtCollecte/Collect.model';

@Injectable({
  providedIn: 'root'
})
export class CollecteService {
  private baseUrl = 'http://localhost:8082/ecoCycleTech/Collect'; 

  constructor(private http: HttpClient) {}

  saveCollecte(collecte: Collecte): Observable<Collecte> {
    return this.http.post<Collecte>(`${this.baseUrl}/saveCollect`, collecte);
  }

  getCollecteById(id: number): Observable<Collecte> {
    return this.http.get<Collecte>(`${this.baseUrl}/getCollect/${id}`);
  }

  getAllCollectes(): Observable<Collecte[]> {
    return this.http.get<Collecte[]>(`${this.baseUrl}/all`);
  }

  updateCollecte(collecte: Collecte): Observable<Collecte> {
    return this.http.put<Collecte>(`${this.baseUrl}/updateCollect`, collecte);
  }

  deleteCollecte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteCollect/${id}`);
  }

  planCollecte(idDemande: number, idPoint: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/planCollecte/${idDemande}/${idPoint}`,
      null, // No body needed for this request
      { observe: 'response' } // Get full response
    ).pipe(
      catchError(error => {
        console.error('Detailed error:', error);
        throw error;
      })
    );
  }
}
