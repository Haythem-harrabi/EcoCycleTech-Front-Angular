import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(private http: HttpClient) {}
  createCheckoutSession(reservationId: number, amount: number) {
    return this.http.post<{ url: string }>(
    'http://localhost:8090/ecoCycleTech/api/payment/create-checkout-session'
      ,
      null,
      {
        params: {
          reservationId: reservationId.toString(),
          amount: amount.toString()
        }
      }
    );
  }

}
