import { AuthService } from 'src/app/client/UserManagement/services/auth.service';
import { PaiementService } from './../services/paiement.service';
import { ReservationService } from './../services/reservation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../model/reservation';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  listReservations: any[] = [];
  id!: number;
  reservation!: Reservation;
  isAscending: boolean = true;
  userRole: string = 'CLIENT';
  private destroy$ = new Subject<void>();

  sortedReservations = [...this.listReservations];
  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private paiementService: PaiementService,
    private route: ActivatedRoute,
    private authService:AuthService
  ) {
  }
  toggleSort() {

    this.isAscending = !this.isAscending;
    this.sortReservations();
  }
  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  get isClient(): boolean {
    return this.userRole === 'CLIENT';
  }
  sortReservations() {
    this.sortedReservations = this.listReservations.sort((a, b) => {
      if (this.isAscending) {
        return a.date.localeCompare(b.date);
      } else {
        return b.date.localeCompare(a.date);
      }
    });
  }

  payer(idReservation: number, montant: number) {
    this.paiementService.createCheckoutSession(idReservation, montant).subscribe({
      next: (res: any) => {
        window.location.href = res.url;
      },
      error: (err: any) => {
        console.error(err);
        alert("Erreur lors de la création de la session de paiement.");
      }
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;

    // Use the authService's currentUser$ Observable
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$) // Recommended to prevent memory leaks
    ).subscribe(currentUser => {
      if (currentUser && currentUser.id) {
        // User is logged in - fetch their reservations
        this.reservationService.getReservationsByUser(currentUser.id).subscribe({
          next: (data) => {
            this.listReservations = data;
          },
          error: (err) => {
            console.error('Error fetching user reservations:', err);
            alert('Failed to load your reservations. Please try again later.');
          }
        });
      } else {
        // User is not logged in - fetch all reservations or handle accordingly
        this.reservationService.getReservations().subscribe({
          next: (data) => {
            this.listReservations = data;
          },
          error: (err) => {
            console.error('Error fetching reservations:', err);
            alert('Failed to load reservations. Please try again later.');
          }
        });
      }
    });

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.reservationService.getReservationById(this.id).subscribe(
        (data) => {
          this.reservation = data;
          console.log(this.reservation);
        },
        (err) => {
          console.error('Error fetching reservation:', err);
          alert('Failed to load reservation data. Please try again later.');
        }
      );
    }
  }

  supprimer(idReservation: number) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(idReservation).subscribe({
        next: () => {
          this.listReservations = this.listReservations.filter(
            r => r.idReservation !== idReservation
          );
        },
        error: (err) => {
          console.error('Failed to delete reservation:', err);
          alert('Cannot delete: Reservation may be linked to devices or invoices.');
        }
      });
    }
  }
}
