import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avis } from '../model/avis';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  private apiUrl = 'http://localhost:8090/ecoCycleTech/api/avis';

  constructor(private http: HttpClient) { }

addAvis(avis: any): Observable<any> {
  return this.http.post(`${this.apiUrl}`, avis, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}

  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }

  getAvisById(id: number): Observable<Avis> {
    return this.http.get<Avis>(`${this.apiUrl}/${id}`);
  }
  updateAvis(id: number, avis: any): Observable<Avis> {
    return this.http.put<Avis>(`${this.apiUrl}/${id}`, avis, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
