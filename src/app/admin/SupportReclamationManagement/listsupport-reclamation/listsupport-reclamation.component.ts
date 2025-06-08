import { Component, OnInit } from '@angular/core';
import { SupportReclamationService } from '../../../services/support-reclamation.service';
import { ReclamationService } from '../../../services/reclamation.service';
import { SupportReclamation } from '../../models/support-reclamation.model';
import { Reclamation } from '../../models/reclamation.model';
import { MatDialog } from '@angular/material/dialog';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-listsupport-reclamation',
  templateUrl: './listsupport-reclamation.component.html',
  styleUrls: ['./listsupport-reclamation.component.css']
})
export class ListsupportReclamationComponent implements OnInit {
  supportReclamations: SupportReclamation[] = [];
  reclamations: Reclamation[] = [];
  selectedSupportReclamation: SupportReclamation | null = null;
  showEditForm = false;

  constructor(
    private supportReclamationService: SupportReclamationService,
    private toastr: ToastrService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.loadSupportReclamations();
    this.loadReclamations();
  }

  loadSupportReclamations(): void {
    this.supportReclamationService.getAll().subscribe({
      next: (data) => this.supportReclamations = data,
      error: (err) => console.error('Error fetching support reclamations:', err)
    });
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => this.reclamations = data,
      error: (err) => console.error('Error fetching reclamations:', err)
    });
  }

  openEditForm(supportReclamation: SupportReclamation): void {
    this.selectedSupportReclamation = {
      ...supportReclamation,
      dateOuvertureSupport: supportReclamation.dateOuvertureSupport instanceof Date
        ? supportReclamation.dateOuvertureSupport.toISOString().split('T')[0]
        : supportReclamation.dateOuvertureSupport,
      dateClotureSupport: supportReclamation.dateClotureSupport instanceof Date
        ? supportReclamation.dateClotureSupport?.toISOString().split('T')[0]
        : supportReclamation.dateClotureSupport
    };
    this.showEditForm = true;
  }

  saveSupportReclamation(): void {
    if (
      this.selectedSupportReclamation &&
      this.selectedSupportReclamation.idSupportReclamation &&
      this.selectedSupportReclamation.reclamation
    ) {
      const supportReclamationToSave: SupportReclamation = {
        ...this.selectedSupportReclamation,
        reclamation: {
          idReclamation: this.selectedSupportReclamation.reclamation.idReclamation
        }
      };

      this.supportReclamationService
        .update(this.selectedSupportReclamation.idSupportReclamation, supportReclamationToSave)
        .subscribe({
          next: () => {
            this.loadSupportReclamations();
            this.closeEditForm();
          },
          error: (err) => console.error('Error updating support reclamation:', err)
        });
    }
  }

  deleteSupportReclamation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce support ?')) {
      this.supportReclamationService.delete(id).subscribe({
        next: () => {
          this.loadSupportReclamations();
          this.toastr.success('Support supprimé avec succès !', 'Suppression réussie');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du support :', err);
          this.toastr.error('Une erreur est survenue lors de la suppression.', 'Erreur');
        }
      });
    }
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.selectedSupportReclamation = null;
  }

 
}
