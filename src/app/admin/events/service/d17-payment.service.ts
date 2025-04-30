import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class D17PaymentService {
  processPayment(amount: number): Observable<boolean> {
    return of(true).pipe(delay(1000)); // Simulate success
  }
}