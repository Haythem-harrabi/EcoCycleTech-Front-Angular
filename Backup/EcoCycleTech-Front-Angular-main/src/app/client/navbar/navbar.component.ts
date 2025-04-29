import { Component, HostListener } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../models/reclamation.model'; // adjust path
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  // Inject both services into the constructor
  constructor(
    public router: Router,
    private reclamationService: ReclamationService
  ) {}
  ngOnInit(): void {
    this.fetchAllReclamations();
  }
  
  // Add reclamation details to be sent to the backend
  reclamation: Reclamation = {
    titreReclamation: '',
    descriptionReclamation: '',
    etatReclamation: 'EN_ATTENTE',
  };

  // Store reclamation details
  reclamationDetails: Reclamation | null = null;

  // Store the list of reclamations
  reclamations: Reclamation[] = []; // Declare reclamations as an array

  errorMessage: string | null = null; // Error message in case of failure
  isLoading = false; // Loading state for UI feedback

  // Method to navigate to reclamation details page
  goToReclamationDetails(): void {
    const reclamationId = 1; // You may dynamically fetch this ID
    this.router.navigate(['/reclamation', reclamationId]);
  }

  // Method to navigate to the list of reclamations
  goToReclamationsList(): void {
    this.router.navigate(['/reclamations']);
  }

  // Method to fetch all reclamations
  fetchAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data; // Assign the list of reclamations here
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching all reclamations.';
        this.isLoading = false;
        console.error('Error fetching reclamations:', error);
      }
    );
  }

  // Add a new reclamation
  addReclamation(): void {
    if (this.reclamation.titreReclamation && this.reclamation.descriptionReclamation) {
      this.reclamationService.addReclamation(this.reclamation).subscribe(
        (newReclamation) => {
          console.log('Reclamation added successfully:', newReclamation);
          this.reclamation = {
            titreReclamation: '',
            descriptionReclamation: '',
            etatReclamation: 'EN_ATTENTE',
          };
        },
        (error) => {
          console.error('Error adding reclamation:', error);
        }
      );
    } else {
      console.error('Title and description are required.');
    }
  }

  // Method to handle the dropdown visibility toggle
  SetActive(event: MouseEvent) {
    const element = event.target as HTMLElement;
    const parentElement = element.closest('.nav-element') as HTMLElement;
    const dropdownelement = parentElement.querySelector('.dropdown-menu') as HTMLElement;
    
    console.log(parentElement);
    console.log(dropdownelement);
    
    if (parentElement.classList.contains('active')) {
      parentElement.classList.remove('active');
      dropdownelement.classList.add('hidden');
    } else {
      document.querySelectorAll('.active').forEach((el) => {
        el.classList.remove('active');
      });

      document.querySelectorAll('.dropdown-menu').forEach((dl) => {
        dl.classList.add('hidden');
      });

      if (parentElement) {
        parentElement.classList.add('active');
        dropdownelement.classList.remove('hidden');
        dropdownelement.classList.add('scalein');
      }
    }
  }

  // Method to consult reclamation details by ID
  consultReclamation(id: number) {
    this.isLoading = true;
    this.reclamationService.getById(id).subscribe(
      (data) => {
        this.reclamationDetails = data; // Save details
        this.isLoading = false; // Stop loading
      },
      (error) => {
        this.errorMessage = 'Error fetching reclamation details.';
        this.isLoading = false; // Stop loading
        console.error('Error fetching reclamation:', error);
      }
    );
  }

  // Handle clicks outside the dropdowns
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideNav = target.closest('.nav-element');
    const clickedInsideDropdown = target.closest('.dropdown-menu');

    if (!clickedInsideNav && !clickedInsideDropdown) {
      document.querySelectorAll('.dropdown-menu').forEach((el) => {
        el.classList.add('hidden');
      });

      document.querySelectorAll('.nav-element.active').forEach((el) => {
        el.classList.remove('active');
      });
    }
  }
}
