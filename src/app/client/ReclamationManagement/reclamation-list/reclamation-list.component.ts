import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { ReclamationDetailsComponent } from '../reclamation-details/reclamation-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  errorMessage: string | null = null;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 3;
  pagedReclamations: Reclamation[] = [];

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllReclamations();
  }

  // Fetch all reclamations
  fetchAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;
        this.pagedReclamations = this.getPageReclamations(this.currentPage);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching all reclamations.';
        this.isLoading = false;
        console.error('Error fetching reclamations:', error);
      }
    );
  }

  // Handle page change
  onPageChange(page: number): void {
    this.currentPage = page;
    this.pagedReclamations = this.getPageReclamations(page);
  }

  // Get reclamations for the current page
  getPageReclamations(page: number): Reclamation[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    return this.reclamations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToReclamationDetails(id?: number): void {
    if (id !== undefined) {
      this.router.navigate(['/reclamation', id]);
    } else {
      console.warn('Reclamation ID is undefined');
    }
  }

  sortByState(): void {
    this.reclamations.sort((a, b) => a.etatReclamation.localeCompare(b.etatReclamation));
    this.pagedReclamations = this.getPageReclamations(this.currentPage);  // Re-apply pagination after sort
  }


}
