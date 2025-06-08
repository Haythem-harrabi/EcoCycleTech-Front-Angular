import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { FactureService } from '../services/facture.service';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    MatChipsModule,
    CommonModule,
    QRCodeModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  qrCodeData: string = '';
  reservation: any = null;
  facture: any = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private factureService: FactureService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const reservationId = +params['id']; // Convert to number
        this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

        if (reservationId && !isNaN(reservationId)) {
          this.processPaymentSuccess(reservationId);
        } else {
          this.handleError('Invalid reservation ID');
        }
      },
      error: (err) => this.handleError('Failed to load reservation details')
    });
  }

  private processPaymentSuccess(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        if (!reservation) {
          this.handleError('Reservation not found');
          return;
        }
        this.reservation = reservation;
        this.createFacture(reservation.idReservation);
console.log('Reservation details:', reservation);
    },
      error: (err: HttpErrorResponse) => {
        this.handleError(err.error?.message || 'Failed to fetch reservation');
      }
    });
  }

  private createFacture(reservationId: number): void {
    this.factureService.createFactureForReservation(reservationId).subscribe({
      next: (facture) => {
        if (!facture?.pdfUrl) {
          this.handleError('Invoice generated but PDF URL missing');
          return;
        }
        this.facture = facture;
        this.generateQRCode();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err.error?.message || 'Invoice generation failed');
      }
    });
  }

  private generateQRCode(): void {
    if (!this.facture?.pdfUrl) {
      this.handleError('No invoice PDF available for QR code');
      return;
    }
    this.qrCodeData = this.facture.pdfUrl;
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.snackBar.open(message, 'Close', { duration: 5000 });
    console.error(message);
  }

  downloadQRCode(): void {
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error('QR Code not rendered yet');

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `invoice-${this.reservation?.idReservation || 'unknown'}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      this.handleError('Failed to download QR code: ' + (error as Error).message);
    }
  }

  viewInvoice(): void {
    if (!this.facture?.pdfUrl) {
      this.handleError('Invoice PDF not available');
      return;
    }
    window.open(this.facture.pdfUrl, '_blank', 'noopener,noreferrer');
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
