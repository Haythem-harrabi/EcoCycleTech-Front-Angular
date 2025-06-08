import { Reservation } from './../model/reservation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = '/api/reservations';

  constructor(private http: HttpClient) {}
  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user reservations:', error);
        return throwError(error);
      })
    );
  }
  createReservation(reservation: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, reservation, { headers });
  }
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  updateReservation(id: number,reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }


  //////
  generateQRCodeData(reservation: any): string {
    return JSON.stringify({
      id: reservation.idReservation,
      client: reservation.client,
      date: reservation.date,
      total: reservation.total,
      items: reservation.panier.map((item: any) => item.nom)
    });
  }
}
