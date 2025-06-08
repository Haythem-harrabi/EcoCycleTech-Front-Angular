import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-reclamation',
  templateUrl: './update-reclamation.component.html',
  styleUrls: ['./update-reclamation.component.css']
})
export class UpdateReclamationComponent implements OnInit {
  reclamation: Reclamation | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  
  

  constructor(
    private reclamationService: ReclamationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idReclamation = Number(this.route.snapshot.paramMap.get('id'));
    if (idReclamation) {
      this.fetchReclamation(idReclamation);
    } else {
      this.errorMessage = 'Invalid reclamation ID.';
    }
  }

  fetchReclamation(id: number): void {
    this.isLoading = true;
    this.reclamationService.getById(id).subscribe({
      next: (data) => {
        this.reclamation = { ...data, dateCreation: new Date(data.dateCreation) };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reclamation:', err);
        this.errorMessage = 'Failed to load reclamation details.';
        this.isLoading = false;
      }
    });
  }

  updateReclamation(form: NgForm): void {
    if (this.isLoading || !this.reclamation || !this.reclamation.idReclamation) return;

    if (!this.reclamation.titreReclamation || !this.reclamation.descriptionReclamation) {
      return;
    }

    this.isLoading = true;

    const payload: Reclamation = {
      idReclamation: this.reclamation.idReclamation,
      titreReclamation: this.reclamation.titreReclamation,
      descriptionReclamation: this.reclamation.descriptionReclamation,
      etatReclamation: this.reclamation.etatReclamation,
      dateCreation: this.reclamation.dateCreation.toString().split('T')[0],
      user: this.reclamation.user
    };

    this.reclamationService.updateReclamation(this.reclamation.idReclamation, payload).subscribe({
      next: (updatedReclamation) => {
        
        console.log('Reclamation updated successfully:', updatedReclamation);
        this.toastr.success('The complaint has been updated!', 'Thank You for Your Contribution');
        this.router.navigate(['/claim']);
      },
      error: (err) => {
        console.error('Error updating reclamation:', err);
        const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/claim']);
  }
}
