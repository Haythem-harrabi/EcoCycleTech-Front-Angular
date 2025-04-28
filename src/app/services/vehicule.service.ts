import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from '../models/vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://localhost:8090/ecoCycleTech/Vehicule';

  constructor(private http: HttpClient) {}

  getAllVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/getVehicule/${id}`);
  }

  saveVehicule(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.apiUrl}/savevehicule`, vehicule);
  }

  updateVehicule(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/updateVehicule`, vehicule);
  }

  deleteVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteVehicule/${id}`);
  }

  getAvailable(date: string, startTime: string, endTime: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules/available`, {
      params: { date, startTime, endTime }
    });
  }
}