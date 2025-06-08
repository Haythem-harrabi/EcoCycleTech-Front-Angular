import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { Router } from '@angular/router';

import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-list-reclamation-admin',
  templateUrl: './list-reclamation-admin.component.html',
  styleUrls: ['./list-reclamation-admin.component.css']
})
export class ListReclamationAdminComponent implements OnInit {
  reclamations: Reclamation[] = [];
  errorMessage: string | null = null;
  isLoading = false;
  paginatedReclamations: Reclamation[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = 3;
  

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAllReclamations();
  }

  fetchAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.totalPages = Math.ceil(this.reclamations.length / this.itemsPerPage); 
        this.paginateReclamations(); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching reclamations:', error);
        this.errorMessage = 'Failed to load reclamations. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  paginateReclamations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReclamations = this.reclamations.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateReclamations();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateReclamations(); 
    }
  }


  goToReclamationDetails(id?: number): void {
    if (id != null) {
      this.router.navigate(['/reclamation', id]);
    }
  }

  updateReclamation(id?: number): void {
    if (id != null) {
      this.router.navigate(['/admin/update/reclamation', id]);
    }
  }

  
  deleteReclamation(id?: number): void {
    if (id == null) {
      this.errorMessage = 'Cannot delete: Reclamation ID is missing.';
      return;
    }

    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.isLoading = true;
      this.reclamationService.delete(id).subscribe({
        next: () => {
          this.reclamations = this.reclamations.filter(r => r.idReclamation !== id);
          this.errorMessage = null;
          this.isLoading = false;
          this.toastr.success('Réclamation supprimée avec succès', 'Succès');
        },
        error: (err) => {
          console.error('Échec de la suppression :', err);
          this.errorMessage = 'Erreur lors de la suppression.';
          this.toastr.error('La suppression a échoué.', 'Erreur');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
  goToCreateSupportReclamation(): void {
    this.router.navigate(['admin/supportreclamtion/create']);
  }

  exportReclamationAsPDF(reclamation: Reclamation): void {
    const doc = new jsPDF();
  
    const creationDate = reclamation.dateCreation
      ? new Date(reclamation.dateCreation).toLocaleDateString()
      : 'N/A';
    const complaintDate = reclamation.dateReclamation
      ? new Date(reclamation.dateReclamation).toLocaleDateString()
      : 'N/A';
  
    const logoImg = new Image();
    logoImg.src = 'assets/img/logo.png';
  
    logoImg.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 35;
      const logoHeight = 20;
      const xLogo = pageWidth - logoWidth - 14;
      doc.addImage(logoImg, 'PNG', xLogo, 10, logoWidth, logoHeight);

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const appName = 'ecoCycleTech';
      const appNameWidth = doc.getTextWidth(appName);
      doc.text(appName, (pageWidth - appNameWidth) / 2, 25);
  
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      const title = `Complaint Details #${reclamation.idReclamation ?? ''}`;
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 35);
  
      autoTable(doc, {
        startY: 45,
        head: [['Field', 'Value']],
        body: [
          ['ID', reclamation.idReclamation?.toString() ?? ''],
          ['Title', reclamation.titreReclamation ?? ''],
          ['Description', reclamation.descriptionReclamation ?? ''],
          ['Complaint Date', complaintDate],
          ['Status', reclamation.etatReclamation ?? ''],
          ['User', reclamation.user?.idUser?.toString() ?? 'Not assigned']
        ],
        styles: {
          halign: 'left',
          fontSize: 11,
          cellPadding: 4,
          textColor: '#333'
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: '#fff',
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 10, left: 14, right: 14 }
      });
  

      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(100);
      const signatureText = '_________________________\nGenerated by the Complaint Service – ecoCycleTech';
      const lines = signatureText.split('\n');
      lines.forEach((line, i) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - textWidth - 14, finalY + (i * 7));
      });
  
  
      doc.save(`Complaint_ecoCycleTech_${reclamation.idReclamation}.pdf`);
    };
  }


  speakDescription(description: string): void {
    const synth = window.speechSynthesis;
  
    if (synth.speaking) {
      synth.cancel(); 
    }
  
    if (description) {
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.lang = 'en-US'; 
      synth.speak(utterance);
    }
  }
  
}
