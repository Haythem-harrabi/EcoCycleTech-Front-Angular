import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';

@Component({
  selector: 'app-reclamation-details',
  templateUrl: './reclamation-details.component.html',
  styleUrls: ['./reclamation-details.component.css']
})
export class ReclamationDetailsComponent implements OnInit {
  reclamationDetails: Reclamation | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private reclamationService: ReclamationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const idReclamation = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID from route:', idReclamation);

    this.isLoading = true;
    this.reclamationService.getById(idReclamation).subscribe({
      next: (data) => {
        console.log('Data loaded:', data);
        this.reclamationDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reclamation:', err);
        this.errorMessage = 'Failed to load reclamation details.';
        this.isLoading = false;
      }
    });
  }

  deleteReclamation() {
    if (!this.reclamationDetails || !this.reclamationDetails.idReclamation) {
      this.errorMessage = 'Cannot delete: Reclamation ID is missing.';
      return;
    }

    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.isLoading = true;
      this.reclamationService.delete(this.reclamationDetails.idReclamation).subscribe({
        next: () => {
          console.log('Reclamation deleted successfully');
          this.isLoading = false;
          this.router.navigate(['/claim']);
        },
        error: (err) => {
          console.error('Failed to delete reclamation:', err);
          this.errorMessage = 'Failed to delete reclamation.';
          this.isLoading = false;
        }
      });
    }
  }

  updateReclamation() {
    if (!this.reclamationDetails || !this.reclamationDetails.idReclamation) {
      this.errorMessage = 'Cannot update: Reclamation ID is missing.';
      return;
    }

    this.router.navigate(['reclamation/update', this.reclamationDetails.idReclamation]);
  }
}