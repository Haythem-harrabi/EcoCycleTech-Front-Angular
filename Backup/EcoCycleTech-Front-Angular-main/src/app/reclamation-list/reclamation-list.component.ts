import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';
import { ReclamationDetailsComponent } from '../client/reclamation-details/reclamation-details.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {

  // Store the list of reclamations
  reclamations: Reclamation[] = [];
  errorMessage: string | null = null;  // Error message in case of failure
  isLoading = false;  // Loading state for UI feedback
  constructor(
    private reclamationService: ReclamationService,
    private router: Router  // Inject Router here
  ) {}
  // Fetch all reclamations on component initialization
  ngOnInit(): void {
    this.fetchAllReclamations();
  }
  goToReclamationDetails(id?: number): void {
    if (id !== undefined) {
      this.router.navigate(['/reclamation', id]);
    } else {
      console.warn('Reclamation ID is undefined');
    }
  }
  
  
  // Method to fetch all reclamations
  fetchAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;  // Assign the list of reclamations here
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching all reclamations.';  // Handle error
        this.isLoading = false;
        console.error('Error fetching reclamations:', error);
      }
    );
  }
}
