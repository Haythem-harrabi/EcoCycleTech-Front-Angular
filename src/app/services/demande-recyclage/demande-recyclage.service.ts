import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeRecyclageService {

  private apiUrl = 'http://localhost:8090/ecoCycleTech/demandeRecyclage';

  constructor(private http: HttpClient) { }

  save(demande: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, demande);
  }

  update(demande: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, demande);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`);
  }
  


  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }



  
}
