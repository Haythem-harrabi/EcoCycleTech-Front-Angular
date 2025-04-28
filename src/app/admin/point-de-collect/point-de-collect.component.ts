import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PointCollecteService } from '../../services/point-de-collect.service';
import { PointCollecte } from '../../models/point-de-collect';
import { NgForm } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-point-de-collect',
  templateUrl: './point-de-collect.component.html',
  styleUrls: ['./point-de-collect.component.css']
})
export class PointDeCollectComponent implements OnInit, AfterViewInit {
  points: PointCollecte[] = [];
  filteredPoints: PointCollecte[] = [];
  deleteId: number | null = null;
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showModal = false;
  showDeleteModal = false;
  isLoading = false;
  error: string | null = null;

  point: PointCollecte = {
    adressePointCollecte: '',
    numTelephonePointCollecte: '',
    emailPointCollecte: '',
    heureOuverturePointCollecte: '08:00',
    heureFermeturePointCollecte: '18:00',
    capacitePointCollecte: 0,
    disponibilitePointCollecte: 'DISPONIBLE',
    latitude: 0,
    longitude: 0,
    availableDays: []
  };

  isEditMode = false;
  wasSubmitted = false;
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  selectedLocationName = '';
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(private pointService: PointCollecteService) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  loadPoints(): void {
    this.isLoading = true;
    this.pointService.getAllPoints().subscribe({
      next: (data) => {
        this.points = data;
        this.filteredPoints = [...this.points];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load collection points: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  initMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([36.8065, 10.1815], 13); // Default to Tunis

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.updateMapMarker(e.latlng.lat, e.latlng.lng);
        this.reverseGeocode(e.latlng.lat, e.latlng.lng);
      });
    }
  }

  updateMapMarker(lat: number, lng: number): void {
    this.point.latitude = lat;
    this.point.longitude = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else if (this.map) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  reverseGeocode(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.selectedLocationName = data.display_name;
        this.point.adressePointCollecte = data.display_name;
      })
      .catch(err => {
        console.error('Reverse geocoding error:', err);
        this.selectedLocationName = `Location (${lat.toFixed(6)}, (${lng.toFixed(6)})`;
        this.point.adressePointCollecte = this.selectedLocationName;
      });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
    setTimeout(() => this.initMap(), 0); // Ensure map is initialized
  }

  openEditModal(point: PointCollecte): void {
    this.isEditMode = true;
    this.point = { ...point };
    this.showModal = true;
    
    setTimeout(() => {
      this.initMap();
      if (this.map && this.point.latitude && this.point.longitude) {
        this.map.setView([this.point.latitude, this.point.longitude], 15);
        this.updateMapMarker(this.point.latitude, this.point.longitude);
      }
    }, 0);
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

    this.isLoading = true;
    this.error = null;

    const operation = this.isEditMode 
      ? this.pointService.updatePoint(this.point.idPointCollecte!, this.point)
      : this.pointService.createPoint(this.point);

    operation.subscribe({
      next: () => {
        this.loadPoints();
        this.closeModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (this.deleteId) {
      this.isLoading = true;
      this.pointService.deletePoint(this.deleteId).subscribe({
        next: () => {
          this.loadPoints();
          this.closeDeleteModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error deleting point: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.point = {
      adressePointCollecte: '',
      numTelephonePointCollecte: '',
      emailPointCollecte: '',
      heureOuverturePointCollecte: '08:00',
      heureFermeturePointCollecte: '18:00',
      capacitePointCollecte: 0,
      disponibilitePointCollecte: 'DISPONIBLE',
      latitude: 0,
      longitude: 0,
      availableDays: []
    };
    this.wasSubmitted = false;
    this.selectedLocationName = '';
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  updateDaySelection(day: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.point.availableDays.includes(day)) {
        this.point.availableDays.push(day);
      }
    } else {
      this.point.availableDays = this.point.availableDays.filter(d => d !== day);
    }
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
    this.filteredPoints.sort((a, b) => {
      const valA = a[this.sortColumn as keyof PointCollecte];
      const valB = b[this.sortColumn as keyof PointCollecte];
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
    this.filteredPoints = this.points.filter(p =>
      (p.adressePointCollecte || '').toLowerCase().includes(q) ||
      (p.numTelephonePointCollecte || '').toLowerCase().includes(q) ||
      (p.emailPointCollecte || '').toLowerCase().includes(q) ||
      (p.disponibilitePointCollecte || '').toLowerCase().includes(q)
    );
    this.sortData();
  }
}