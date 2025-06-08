import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appareil } from '../model/appareil';

@Component({
  selector: 'app-reservation-confirmation-dialog',
  templateUrl: './comfirmationdialog.component.html',
  styleUrls: ['./comfirmationdialog.component.css']
})
export class ReservationConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReservationConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      appareil?: Appareil;
      cancelText?: string;
      confirmText?: string;
      action?: string;
    }
  ) {}

  onContinueShopping(): void {
    this.dialogRef.close(false);
  }

  onProceedToCheckout(): void {
    this.dialogRef.close(true);
  }
}