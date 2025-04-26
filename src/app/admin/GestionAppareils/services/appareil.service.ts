// src/app/appareil/appareil.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Appareil } from '../model/appareil';

@Injectable({
  providedIn: 'root',
})
export class AppareilService {
  getRecommendations(query: string) {
    throw new Error('Method not implemented.');
  }
  private flaskApiUrl = 'http://localhost:5000';

  private apiUrl = 'http://localhost:8090/ecoCycleTech/api/appareils';

  constructor(private http: HttpClient) {}

  createAppareil(appareil: Appareil): Observable<Appareil> {
    return this.http.post<Appareil>(this.apiUrl, appareil);
  }

  getAppareils(): Observable<Appareil[]> {
    return this.http.get<Appareil[]>('http://localhost:8090/ecoCycleTech/api/appareils')
      .pipe(
        catchError((error) => {
          console.error('Error fetching devices:', error);
          return throwError(error);
        })
      );
  }


  getAppareilById(id: number): Observable<Appareil> {
    return this.http.get<Appareil>(`${this.apiUrl}/${id}`);
  }

updateAppareil(id: number, appareil: Appareil): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, appareil);
}

  deleteAppareil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
getAverageRating(appareilId: number): Observable<number> {
  return this.http.get<number>(`http://localhost:8090/ecoCycleTech/api/avis/average/${appareilId}`);
}
  predictPrice(categorie: string, marque: string, averageRating: number): Observable<any> {
    return this.http.post(`${this.flaskApiUrl}/predict-price`, {
      categorie,
      marque,
      averageRating
    });
  }

  saveAppareil(appareil: any): Observable<any> {
    return this.http.post(this.apiUrl, appareil);
  }
  predictPrix(description: string): Observable<number> {
    return this.http.post<number>('http://localhost:8090/ecoCycleTech/api/appareils/predict-prix', { description });
  }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-image`, formData);
  }
}

