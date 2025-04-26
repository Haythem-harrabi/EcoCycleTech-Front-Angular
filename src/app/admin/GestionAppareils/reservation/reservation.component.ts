import { PaiementService } from './../services/paiement.service';
import { ReservationService } from './../services/reservation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../model/reservation';

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
  userRole: number = 1;

  sortedReservations = [...this.listReservations];
  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private paiementService: PaiementService,
    private route: ActivatedRoute
  ) {
  }
  toggleSort() {

    this.isAscending = !this.isAscending;
    this.sortReservations();
  }
  get isAdmin(): boolean {
    return this.userRole === 0;
  }

  get isClient(): boolean {
    return this.userRole === 1;
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
    this.userRole = currentUrl.startsWith('/admin') ? 0 : 1;
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.listReservations = data;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        alert('Failed to load reservations. Please try again later.');
      }
    });

    this.id = +this.route.snapshot.params['id']; // Parse as number
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


  supprimer(idReservation: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(idReservation).subscribe(() => {
        this.listReservations = this.listReservations.filter((reservation) => reservation.idReservation !== idReservation);
      });
    }
  }
}
