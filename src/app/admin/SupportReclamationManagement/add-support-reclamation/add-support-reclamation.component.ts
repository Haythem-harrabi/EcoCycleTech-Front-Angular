import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportReclamationService } from 'src/app/services/support-reclamation.service';
import { SupportReclamation } from 'src/app/admin/models/support-reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service'; // import the reclamation service
import { Reclamation } from 'src/app/admin/models/reclamation.model'; // import the reclamation model
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-support-reclamation',
  templateUrl: './add-support-reclamation.component.html',
  styleUrls: ['./add-support-reclamation.component.css']
})
export class AddSupportReclamationComponent implements OnInit {
  supportReclamation: SupportReclamation = {
    idResponsable: 0,
    nomResponsable: '',
    dateOuvertureSupport: '',
    dateClotureSupport: '',
    reclamation: { idReclamation: 0 }
  };

  reclamations: Reclamation[] = []; 
  errorMessage: string | null = null; 

  constructor(
    private supportService: SupportReclamationService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private reclamationService: ReclamationService 
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
    
    const id = this.route.snapshot.paramMap.get('idReclamation');
    if (id) {
      this.supportReclamation.reclamation = { idReclamation: +id };
    }
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
      },
      error: (err) => {
        console.error('Failed to load reclamations:', err);
        this.errorMessage = 'Failed to load reclamations.';
      }
    });
  }

  submitForm(): void {
    if (!this.supportReclamation.reclamation) {
      this.errorMessage = 'Please select a Reclamation!';
      return;
    }

    console.log('Sending:', this.supportReclamation);
    this.supportService.create(this.supportReclamation).subscribe({
      next: (res) => {
        console.log('SupportReclamation created successfully:', res);
        this.toastr.success('SupportReclamation created successfully!', 'Thank You for Your Contribution');
        this.router.navigate(['admin/listSupportReclamation']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Error creating SupportReclamation.';
      }
    });
  }
}
