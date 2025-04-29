// reclamation.component.ts
import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../services/reclamation.service';
import { Reclamation } from '../models/reclamation.model'; // adjust path


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  constructor(private reclamationService: ReclamationService) {}
  getEtatClass(etat: string): string {
    return etat;
  }
  
  ngOnInit(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data: Reclamation[]) => {
        this.reclamations = data;
      },
      error: (err) => console.error('Erreur:', err)
    });
    console.log('Fetched reclamations:', this.reclamations);

  }
  
}
