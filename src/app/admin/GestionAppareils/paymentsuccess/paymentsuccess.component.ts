import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { FactureService } from '../services/facture.service'; // Add this
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar'; // For error messages
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
  facture: any = null; // Add this
  isLoading: boolean = true;
  errorMessage: string | null = null;
  sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private factureService: FactureService, // Add this
    private snackBar: MatSnackBar // Add this
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const reservationId = params['id'];
        this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
        
        if (reservationId) {
          this.processPaymentSuccess(reservationId);
        } else {
          this.handleError('No reservation ID found in URL');
        }
      },
      error: (err) => this.handleError('Failed to parse route parameters')
    });
  }

  private processPaymentSuccess(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        if (!reservation) {
          this.handleError('Reservation data is empty');
          return;
        }
        this.reservation = reservation;
        this.createFacture(reservation);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Reservation error:', err);
        this.handleError(err.error?.message || 'Failed to load reservation details');
      }
    });
  }

  private createFacture(reservation: any): void {
    this.factureService.createFactureForReservation(reservation.idReservation).subscribe({
      next: (facture) => {
        if (!facture?.pdfUrl) {
          this.handleError('Invoice generated but no PDF URL returned');
          return;
        }
        this.facture = facture;
        this.generateQRCode();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Invoice generation error:', err);
        this.handleError(err.error?.message || 'Failed to generate invoice');
      }
    });
  }

  private generateQRCode(): void {
    if (!this.facture?.pdfUrl) {
      this.handleError('Invoice not available');
      return;
    }

    // QR code will now point directly to the PDF in Google Drive
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
      if (!canvas) throw new Error('QR Code not available');
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `invoice-${this.reservation.idReservation}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      this.handleError('Failed to download QR code');
    }
  }

  viewInvoice(): void {
    if (this.facture?.pdfUrl) {
      window.open(this.facture.pdfUrl, '_blank');
    } else {
      this.handleError('Invoice not available');
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}