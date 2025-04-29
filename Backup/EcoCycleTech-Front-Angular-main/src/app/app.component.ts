import { Component } from '@angular/core';
import { ReclamationService } from './services/reclamation.service'; // adjust the import path
import { Reclamation } from './models/reclamation.model'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  reclamationDetails: Reclamation | null = null; // Store the selected reclamation's details
  errorMessage: string | null = null; 
  title = 'EcoCycleTech-Front';
  isLoading: boolean = false;
  constructor(private reclamationService: ReclamationService) {}

  // Method to consult reclamation by ID
  consultReclamation(id: number) {
    this.isLoading = true; // Start loading
    this.reclamationService.getById(id).subscribe(
      (data) => {
        this.reclamationDetails = data; // Save reclamation details to be displayed
        this.isLoading = false; // Stop loading
      },
      (error) => {
        this.errorMessage = 'Error fetching reclamation details.';
        this.isLoading = false; // Stop loading on error
        console.error('Error fetching reclamation:', error);
      }
    );
}
}