import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicule } from 'src/app/entities/pointDeVenteEtCollecte/vehicule.model';
import { VehiculeService } from 'src/app/services/pointDeVenteEtCollecte/vehicule.service';

@Component({
  selector: 'app-vehicule-list',
  templateUrl: './vehicule-list.component.html',
  styleUrls: ['./vehicule-list.component.css']
})
export class VehiculeListComponent implements OnInit {
  vehicules: Vehicule[] = [];
  filteredVehicules: Vehicule[] = [];
  deleteId: number | null = null;
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showModal = false;
  showDeleteModal = false;

  vehicule: Vehicule = {
    idVehicule: 0,
    marqueVehicule: '',
    modeleVehicule: '',
    nomChauffeur: '',
    numTelephoneChauffeur: 0,
    capaciteVehicule: 0
  };

  isEditMode = false;
  wasSubmitted = false;

  constructor(private vehiculeService: VehiculeService) {}

  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules(): void {
    this.vehiculeService.getAllVehicules().subscribe(
      (data) => {
        this.vehicules = data;
        this.filteredVehicules = [...this.vehicules];
      },
      (error) => {
        console.error('Error fetching vehicules:', error);
      }
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(vehicule: Vehicule): void {
    this.isEditMode = true;
    this.vehicule = { ...vehicule };
    this.showModal = true;
  }

  openDeleteModal(id: number): void {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteId = null;
  }

  saveOrUpdate(form: NgForm): void {
    this.wasSubmitted = true;
    
    if (!form.valid) {
      return;
    }

    if (this.isEditMode) {
      this.updateVehicule();
    } else {
      this.saveVehicule();
    }
  }

  saveVehicule(): void {
    this.vehiculeService.saveVehicule(this.vehicule).subscribe({
      next: () => {
        this.loadVehicules();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving vehicule:', err);
      }
    });
  }

  updateVehicule(): void {
    this.vehiculeService.updateVehicule(this.vehicule).subscribe({
      next: () => {
        this.loadVehicules();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating vehicule:', err);
      }
    });
  }

  confirmDelete(): void {
    if (this.deleteId) {
      this.vehiculeService.deleteVehicule(this.deleteId).subscribe({
        next: () => {
          this.loadVehicules();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting vehicule:', err);
        }
      });
    }
  }

  resetForm(): void {
    this.vehicule = {
      idVehicule: 0,
      marqueVehicule: '',
      modeleVehicule: '',
      nomChauffeur: '',
      numTelephoneChauffeur: 0,
      capaciteVehicule: 0
    };
    this.wasSubmitted = false;
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  sortData(): void {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.filteredVehicules.sort((a, b) => {
      const valA = a[this.sortColumn as keyof Vehicule];
      const valB = b[this.sortColumn as keyof Vehicule];
      if (valA == null) return 1;
      if (valB == null) return -1;
      return valA > valB ? direction : valA < valB ? -direction : 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredVehicules = this.vehicules.filter(v =>
      (v.marqueVehicule || '').toLowerCase().includes(q) ||
      (v.modeleVehicule || '').toLowerCase().includes(q) ||
      (v.nomChauffeur || '').toLowerCase().includes(q) ||
      (v.numTelephoneChauffeur.toString().includes(q)) ||
      (v.capaciteVehicule.toString().includes(q))
    );
    this.sortData();
  }
}