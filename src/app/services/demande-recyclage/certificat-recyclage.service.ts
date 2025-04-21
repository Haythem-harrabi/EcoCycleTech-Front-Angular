import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificatRecyclageService {

  private apiUrl = 'http://localhost:8090/ecoCycleTech/certificatRecyclage';

  constructor(private http: HttpClient) { }

  save(certificat: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, certificat);
  }

  update(certificat: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, certificat);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`);
  }
}
