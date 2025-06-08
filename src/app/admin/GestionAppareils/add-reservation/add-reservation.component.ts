import { ReservationConfirmationDialogComponent } from './../comfirmationdialog/comfirmationdialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ReservationService } from '../services/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppareilService } from '../services/appareil.service';
import { Appareil } from '../model/appareil';
import { Reservation } from '../model/reservation';
import { PanierService } from '../services/panier.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit, OnDestroy {
  reservationForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  allAppareils: Appareil[] = [];
  allUsers: User []=[];
  isEditMode = false;
  currentReservationId: number | null = null;
  private panierTimeout: any;
  appareilsInCart: Appareil[]=[];
  minDate: any;
  http: any;

  constructor(
    private reservationService: ReservationService,
    private appService: AppareilService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private panierService: PanierService,
    private authService: AuthService,

  ) {
    this.reservationForm = this.initForm();
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.reservationForm = this.initForm();
    this.loadAppareils();
    this.checkForEditMode();
    this.setupPanierTimeout();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.reservationForm.patchValue({
        user: currentUser.id, // Pre-fill user ID
      });
    } else {
      this.errorMessage = 'You must be logged in to create a reservation';
      this.router.navigate(['/login']);
    }

    this.appareilsInCart = this.panierService.getAppareilsInCart();
    this.appareilsInCart.forEach(appareil => {
      if (!this.isAppareilInForm(appareil.idAppareil)) {
        this.appareilsArray.push(this.createAppareilFormGroup(appareil));
      }
    });
    this.calculateTotal();
  }

  private setupPanierTimeout(): void {
    this.panierTimeout = setTimeout(() => {
      this.panierService.clearPanier();
      if (!this.isEditMode && this.appareilsArray.length > 0) {
        this.router.navigate(['/appareils']);
      }
    }, 7200000);
  }

  ngOnDestroy(): void {
    if (this.panierTimeout) {
      clearTimeout(this.panierTimeout);
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      user: new FormControl(''), // Pre-fill user ID from current user
      date: new FormControl('', Validators.required),
      statut: new FormControl('Pending', Validators.required),
      appareils: new FormArray([], Validators.required),
      total: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });
  }

  private checkForEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.currentReservationId = +params['id'];
        this.loadReservationForEdit(this.currentReservationId);
      }
    });
  }


  private loadReservationForEdit(reservationId: number): void {
    this.isLoading = true;

    this.appService.getAppareils().subscribe({
      next: (appareils) => {
        this.allAppareils = appareils;

        // Now load the reservation
        this.reservationService.getReservationById(reservationId).subscribe({
          next: (reservation: Reservation) => {
            this.isLoading = false;

            let idUser = reservation.idUser;
            if (!idUser) {
              const currentUser = this.authService.getCurrentUser();
              idUser = currentUser ? currentUser.id : null;
            }
            this.reservationForm.patchValue({
              user: idUser,
              date: reservation.date,
              statut: reservation.statut,
              total: reservation.total
            });


            this.appareilsArray.clear();
            if (reservation.panier) {
              reservation.panier.forEach(appareil => {
                // Find the full appareil details from allAppareils
                const fullAppareil = this.allAppareils.find(a => a.idAppareil === appareil.idAppareil);
                if (fullAppareil) {
                  this.appareilsArray.push(this.createAppareilFormGroup(fullAppareil));
                }
              });
            }

            this.calculateTotal();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to load reservation details';
            console.error('Error loading reservation:', err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load devices list';
        console.error('Error loading appareils:', err);
      }
    });
  }
  // Add this to your component class
addNewAppareil(): void {
  this.appareilsArray.push(this.createEmptyAppareilFormGroup());
}

private createEmptyAppareilFormGroup(): FormGroup {
  return new FormGroup({
    idAppareil: new FormControl('', Validators.required),
    nom: new FormControl(''),
    prix: new FormControl(0)
  });
}

onAppareilChange(event: any, index: number): void {
  const selectedId = event.target.value;
  const selectedAppareil = this.allAppareils.find(a => a.idAppareil == selectedId);

  if (selectedAppareil) {
    const appareilGroup = this.appareilsArray.at(index) as FormGroup;
    appareilGroup.patchValue({
      nom: selectedAppareil.nom,
      prix: selectedAppareil.prix
    });
    this.calculateTotal();
  }
}
  private loadAppareilById(id: number): void {
    this.appService.getAppareilById(id).subscribe({
      next: (appareil) => this.addAppareilToForm(appareil),
      error: (err) => {
        console.error('Error loading appareil:', err);
        this.errorMessage = 'Failed to load selected device';
      }
    });
  }

  private addAppareilToForm(appareil: Appareil): void {
    if (!this.isAppareilInForm(appareil.idAppareil)) {
      this.appareilsArray.push(this.createAppareilFormGroup(appareil));
      this.calculateTotal();
      this.reservationForm.get('selectedAppareil')?.setValue(appareil.idAppareil);
    }
  }

  private isAppareilInForm(appareilId: number): boolean {
    return this.appareilsArray.controls.some(
      control => control.value.idAppareil === appareilId
    );
  }

  private createAppareilFormGroup(appareil: Appareil): FormGroup {
    return new FormGroup({
      idAppareil: new FormControl(appareil.idAppareil),
      nom: new FormControl(appareil.nom),
      prix: new FormControl(appareil.prix)
    });
  }


  get appareilsArray(): FormArray {
    return this.reservationForm.get('appareils') as FormArray;
  }

  loadAppareils(): void {
    this.appService.getAppareils().subscribe({
      next: (appareils) => this.allAppareils = appareils,
      error: (err) => this.errorMessage = 'Error loading devices list'
    });
  }

  onAddAppareil(): void {
    const selectedId = this.reservationForm.get('selectedAppareil')?.value;
    if (!selectedId) {
      this.errorMessage = 'Please select a device';
      return;
    }

    const selectedAppareil = this.allAppareils.find(a => a.idAppareil === selectedId);
    if (!selectedAppareil) {
      this.errorMessage = 'Device not found';
      return;
    }

    if (this.isAppareilInForm(selectedId)) {
      this.errorMessage = 'Device already added';
      return;
    }

    const dialogRef = this.dialog.open(ReservationConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Add Another Device?',
        message: 'Do you want to add another device to your reservation?',
        cancelText: 'No, Proceed to Reservation',
        confirmText: 'Yes, Add Another'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appareilsArray.push(this.createAppareilFormGroup(selectedAppareil));
        this.calculateTotal();
        this.reservationForm.get('selectedAppareil')?.reset();
        this.errorMessage = null;
      } else {
        this.appareilsArray.push(this.createAppareilFormGroup(selectedAppareil));
        this.calculateTotal();
        this.errorMessage = null;
      }
    });
  }

  removeAppareil(index: number): void {
    this.appareilsArray.removeAt(index);
    this.calculateTotal();
  }

  private calculateTotal(): void {
    const total = this.appareilsArray.controls.reduce(
      (sum, control) => sum + control.value.prix,
      0
    );
    this.reservationForm.get('total')?.setValue(total);
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    const formValue = this.reservationForm.value;

    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to submit a reservation';
      this.router.navigate(['/login']);
      return;
    }

    // Prepare the reservation data
    const reservationData = {
      idReservation: this.currentReservationId ?? 0,
      idUser: currentUser.id,
      date: formValue.date,
      statut: formValue.statut,
      total: formValue.total,
      panier: formValue.appareils.map((appareil: any) => ({
        idAppareil: appareil.idAppareil,
        nom: appareil.nom,
        prix: appareil.prix
      }))
    };

    // Start the loading state
    this.isLoading = true;

    // Decide whether to create or update
    if (this.isEditMode && this.currentReservationId) {
      this.reservationService.updateReservation(this.currentReservationId, reservationData)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/Reservations']);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to update reservation';
            console.error('Update error:', err);
          }
        });
    } else {
      this.reservationService.createReservation(reservationData)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.panierService.clearPanier();
            this.router.navigate(['/Reservations']);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to create reservation';
            console.error('Creation error:', err);
          }
        });
    }
  }

    }
