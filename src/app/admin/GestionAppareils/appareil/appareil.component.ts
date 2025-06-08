import { Component, OnInit } from '@angular/core';
import { Appareil } from '../model/appareil';
import { AppareilService } from '../services/appareil.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReservationConfirmationDialogComponent } from '../comfirmationdialog/comfirmationdialog.component';
import { PanierService } from '../services/panier.service';
import { RecommendationService } from '../services/recommendation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-appareil-list',
  templateUrl: './appareil.component.html',
  styleUrls: ['./appareil.component.css']
})
export class AppareilComponent implements OnInit {
  listAppareils: Appareil[] = [];
  appareilForm: FormGroup;
  isEditMode = false;
  currentAppareilId?: number;
  isAscending: boolean = true;
  sortedAppareils: Appareil[] = [];
  userRole: string = 'USER';
  cartItemCount = 0;
  averageRatings: { [key: number]: number } = {};
  snackBar: any;

  constructor(
    private appareilService: AppareilService,
    private panierService: PanierService,
    private router: Router,
    private dialog: MatDialog,
    private recommendationService: RecommendationService,
  ) {
    this.appareilForm = new FormGroup({
      nom: new FormControl('', Validators.required),
      categorie: new FormControl('', Validators.required),
      prix: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      etatAppareil: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {

    const currentUrl = this.router.url;
   this.userRole = currentUrl.startsWith('/admin') ? 'ADMIN' : 'CLIENT';
    this.loadAppareils();
    this.panierService.cartItems$.subscribe(items => {
      this.cartItemCount = items?.length || 0;
    });
  }


  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  get isClient(): boolean {
    return this.userRole === 'USER';
  }
  showRecommendations = false;         // Flag to toggle view

  private loadAppareils(): void {
    this.appareilService.getAppareils().subscribe({
      next: (appareils) => {
        console.log('Devices loaded:', appareils); // Log the response
        if (!appareils || appareils.length === 0) {
          console.error('No devices found.');
        }
        this.listAppareils = appareils;
        this.sortAppareils();
        this.fetchAverageRatings();
      },
      error: (err) => {
        console.error('Error loading devices:', err);
      }
    });
  }

  fetchAverageRatings(): void {
    this.listAppareils.forEach(appareil => {
      this.appareilService.getAverageRating(appareil.idAppareil).subscribe({
        next: (rating) => {
          this.averageRatings[appareil.idAppareil] = rating;
        },
        error: (error) => {
          console.error('Error fetching rating for appareil', appareil.idAppareil, error);
          this.averageRatings[appareil.idAppareil] = 0;
        }
      });
    });
  }
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return (rating % 1) >= 0.5;
  }

  getEmptyStars(rating: number): number[] {
    const full = Math.floor(rating || 0);
    const half = this.hasHalfStar(rating) ? 1 : 0;
    return Array(5 - full - half).fill(0);
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.sortAppareils();
  }

  sortAppareils(): void {
    this.sortedAppareils = [...this.listAppareils].sort((a, b) => {
      return this.isAscending
        ? a.nom.localeCompare(b.nom)
        : b.nom.localeCompare(a.nom);
    });
  }

  onReserve(appareil: Appareil): void {
    const dialogRef = this.dialog.open(ReservationConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation',
        message: 'Voulez-vous ajouter un autre appareil?',
        appareil: appareil,
        cancelText: 'Non, aller à la réservation',
        confirmText: 'Oui, ajouter un autre',
        action: 'reserve' // Add this line
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.panierService.ajouterAppareil(appareil);
      } else {

        this.panierService.ajouterAppareil(appareil);
        if(this.isAdmin)
        {        this.router.navigate(['admin/AddReservation']);
        }
        else{        this.router.navigate(['/AddReservation']);
        }
      }
    });
  }

viewCart(): void {
  if (this.cartItemCount > 0) {
    this.router.navigate(['/panier']); // Updated to use French route
  } else {
    this.snackBar.open('Your cart is empty', 'Close', { duration: 2000 });
  }
}


onCreate(): void {
    if (this.appareilForm.invalid) return;

    const appareilData = this.appareilForm.value;
    if (this.isEditMode && this.currentAppareilId) {
      this.appareilService.updateAppareil( this.currentAppareilId,appareilData)
        .subscribe(() => this.resetForm());
    } else {
      this.appareilService.createAppareil(appareilData)
        .subscribe(() => this.resetForm());
    }
  }
  getSafeImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/img/device.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = 'http://localhost:8090'; // Spring Boot default port
    return `${baseUrl}/images/${imageUrl}`;  }

onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.log('Image failed to load:', img.src);
  img.src = 'assets/img/device.png'; // Make sure this path is correct
  img.onerror = null; // Prevent infinite loop
}
  isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http') &&
             !url.includes('example.com') &&
             !url.includes('/src/resources/');
    } catch {
      return false;
    }
  }
  query = '';
  recommendations: any[] = [];
  getRecommendations(): void {
    this.recommendationService.getRecommendations(this.query).subscribe((data) => {
      this.recommendations = data;
      this.showRecommendations = true;
    });
  }

  onEdit(appareil: Appareil): void {
    this.isEditMode = true;
    this.currentAppareilId = appareil.idAppareil;
    this.appareilForm.patchValue(appareil);
  }

  onDelete(id: number): void {
    if (confirm('Confirm deletion?')) {
      this.appareilService.deleteAppareil(id).subscribe({
        next: () => {
          this.listAppareils = this.listAppareils.filter(a => a.idAppareil !== id);
          this.sortAppareils();
        },
        error: (err) => console.error('Error deleting device:', err)
      });
    }
  }

  private resetForm(): void {
    this.appareilForm.reset();
    this.isEditMode = false;
    this.currentAppareilId = undefined;
    this.loadAppareils();
  }

}
