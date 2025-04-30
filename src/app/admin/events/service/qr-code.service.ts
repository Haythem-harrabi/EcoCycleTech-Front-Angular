// qr-code.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QrCodeService {
  private baseUrl = 'https://api.qrserver.com/v1/create-qr-code';

  generateQRCode(data: string, size: number = 200): Observable<string> {
    // This is a real free API - no mock needed
    const url = `${this.baseUrl}/?data=${encodeURIComponent(data)}&size=${size}x${size}`;
    return of(url).pipe(delay(300)); // Simulate network delay
  }
}