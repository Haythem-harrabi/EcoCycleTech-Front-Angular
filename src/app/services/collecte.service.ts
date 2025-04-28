import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collecte } from '../models/Collect.model'; 

@Injectable({
  providedIn: 'root'
})
export class CollecteService {
  private baseUrl = 'http://localhost:8090/ecoCycleTech/Collect'; 

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

  planCollecte(demandeId: number, pointCollecteId: number): Observable<Collecte> {
    return this.http.post<Collecte>(`${this.baseUrl}/planCollecte/${demandeId}/${pointCollecteId}`, {});
  }
}
