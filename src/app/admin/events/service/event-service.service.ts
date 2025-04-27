import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = 'http://localhost:8090/ecoCycleTech/evenement';

  constructor(private http: HttpClient) { }

  getAllEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}`);
  }

  getEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/${id}`);
  }

  createEvenement(evenement: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiUrl}`, evenement);
  }

  updateEvenement(id: number, evenement: Evenement): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, evenement);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
  
  getEvenementsRecent(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/recent`);
  }
  getEvenementsOldest(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/oldest`);
  }
  getEvenementsToday(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/today`);
  }
  getEvenementsUpcoming(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/upcoming`);
  }
  getEvenementsPast(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/past`);
  }
} 