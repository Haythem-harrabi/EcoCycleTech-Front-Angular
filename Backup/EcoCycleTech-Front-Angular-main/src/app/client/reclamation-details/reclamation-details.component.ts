import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../models/reclamation.model';

@Component({
  selector: 'app-reclamation-details',
  templateUrl: './reclamation-details.component.html',
  styleUrls: ['./reclamation-details.component.css']
})
export class ReclamationDetailsComponent implements OnInit {

  reclamationDetails: Reclamation | null = null; // Ensure this property matches the template
  errorMessage: string | null = null;
  isLoading = false;
 


  constructor(
    private reclamationService: ReclamationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idReclamation = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID from route:', idReclamation);
  
    this.reclamationService.getById(idReclamation).subscribe({
      next: (data) => {
        console.log('Data loaded:', data);
        this.reclamationDetails = data;
      },
      error: (err) => {
        console.error('Failed to load reclamation:', err);
      }
    });
  }
  
}
