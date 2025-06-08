import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DemandeRecyclage } from 'src/app/entities/demanderecyclage/demande-recyclage.model';
import { Collecte } from 'src/app/entities/pointDeVenteEtCollecte/Collect.model';
import { PointCollecte } from 'src/app/entities/pointDeVenteEtCollecte/point-de-collect';
import { Vehicule } from 'src/app/entities/pointDeVenteEtCollecte/vehicule.model';
import { CollecteService } from 'src/app/services/pointDeVenteEtCollecte/collecte.service';
import { PointCollecteService } from 'src/app/services/pointDeVenteEtCollecte/point-de-collect.service';
import { VehiculeService } from 'src/app/services/pointDeVenteEtCollecte/vehicule.service';
import { DemandeRecyclageService } from 'src/app/services/demande-recyclage/demande-recyclage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-collecte-list',
  templateUrl: './collecte-list.component.html',
  styleUrls: ['./collecte-list.component.css']
})
export class CollecteListComponent implements OnInit {
  collectes: Collecte[] = [];
  filteredCollectes: Collecte[] = [];
  points: PointCollecte[] = [];
  vehicules: Vehicule[] = [];
  demandes: DemandeRecyclage[] = [];

  sortColumn: '' | keyof Collecte = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery = '';

  currentCollecte: Collecte = {} as Collecte;
  isEditMode = false;

  constructor(
    private collecteService: CollecteService,
    private pointCollecteService: PointCollecteService,
    private vehiculeService: VehiculeService,
    private demandeService: DemandeRecyclageService
  ) {}

  ngOnInit(): void {
    this.loadCollectes();
    this.pointCollecteService.getAllPoints().subscribe(ps => this.points = ps);
    this.vehiculeService.getAllVehicules().subscribe(vs => this.vehicules = vs);
    this.demandeService.getAll().subscribe(ds => this.demandes = ds);
  }

  private loadCollectes(): void {
    this.collecteService.getAllCollectes().subscribe(data => {
      this.collectes = data;
      this.applyFiltersAndSort();
    });
  }

  onSearch(): void {
    this.applyFiltersAndSort();
  }

  onSort(column: keyof Collecte): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.collectes.filter(c =>
      c.dateCollecte.toLowerCase().includes(q) ||
      c.heureDebutCollecte.toLowerCase().includes(q) ||
      c.heureFinCollecte.toLowerCase().includes(q) ||
      c.pointCollecte.adressePointCollecte.toLowerCase().includes(q) ||
      (c.vehicule?.marqueVehicule.toLowerCase().includes(q) ?? false) ||
      (c.vehicule?.modeleVehicule.toLowerCase().includes(q) ?? false) ||
      (c.demandeRecyclage?.title.toLowerCase().includes(q) ?? false)
    );

    if (this.sortColumn) {
      const key = this.sortColumn;
      list = list.sort((a, b) => {
        const A = String(a[key]).toLowerCase();
        const B = String(b[key]).toLowerCase();
        const cmp = A === B ? 0 : A > B ? 1 : -1;
        return this.sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    this.filteredCollectes = list;
  }

  onDelete(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')) {
      return;
    }
    this.collecteService.deleteCollecte(id).subscribe(() => this.loadCollectes());
  }

  openModal(): void {
    this.isEditMode = false;
    this.currentCollecte = {} as Collecte;
    new bootstrap.Modal(document.getElementById('collecteModal')).show();
  }

  openEditModal(c: Collecte): void {
    this.isEditMode = true;
    this.currentCollecte = { ...c };
    new bootstrap.Modal(document.getElementById('collecteModal')).show();
  }

  saveCollecte(form: NgForm): void {
    if (form.invalid) return;

    const op$ = this.isEditMode
      ? this.collecteService.updateCollecte(this.currentCollecte)
      : this.collecteService.saveCollecte(this.currentCollecte);

    op$.subscribe(() => {
      this.loadCollectes();
      bootstrap.Modal.getInstance(document.getElementById('collecteModal')).hide();
    });
  }
}
