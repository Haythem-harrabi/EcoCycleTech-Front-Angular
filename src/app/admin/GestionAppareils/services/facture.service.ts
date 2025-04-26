import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../model/facture'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8090/ecoCycleTech/api/factures';

  constructor(private http: HttpClient) {}

  // Create a new facture for a reservation
  createFactureForReservation(reservationId: number): Observable<Facture> {
    return this.http.post<Facture>(
      `${this.apiUrl}/create/${reservationId}`,
      null,  // Changed from {} to null
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Get facture by reservation ID
  getFactureByReservationId(reservationId: number): Observable<Facture> {
    return this.http.get<Facture>(
      `${this.apiUrl}/by-reservation/${reservationId}`
    );
  }

  // Download PDF invoice
  downloadFacture(factureId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${factureId}/download`, {
      responseType: 'blob'
    });
  }
}