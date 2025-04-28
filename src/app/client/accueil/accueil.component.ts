import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PointCollecteService } from '../../services/point-de-collect.service';
import { PointCollecte, MapPoint } from '../../models/point-de-collect';
import { CollecteService } from 'src/app/services/collecte.service';
import { DemandeRecyclage } from 'src/app/models/DemandeRecyclage';
import { DemandeRecyclageService } from 'src/app/services/demande-recyclage.service';
import { Etat } from 'src/app/enumerations/Etat';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  private map!: L.Map;
  private userMarker!: L.Marker;
  private nearestMarker: L.Marker | null = null;
  
  userLocation: { lat: number, lng: number } | null = null;
  mapPoints: MapPoint[] = [];
  isLoading = true;
  error: string | null = null;
  selectedPoint: MapPoint | null = null;

  pickupDate = new Date(new Date().setDate(new Date().getDate() + 1)); // Tomorrow
  pickupLoading = false;
  scheduleMessage: string | null = null;
  scheduleSuccess = false;
  showCameraPopup = false;


  


  mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 12,
    center: L.latLng(36.8065, 10.1815) // Default center (Tunisia)
  };
  demandes: DemandeRecyclage[] = []; 
  selectedDemande: DemandeRecyclage | null = null; 

  constructor(private pointCollecteService: PointCollecteService, private collecteService: CollecteService,
    private demandeService: DemandeRecyclageService 

  ) {}

  ngOnInit(): void {
    this.loadMapPoints();
    this.getUserLocation();
    this.loadDemandes(); 

  }
  toggleCameraPopup(): void {
    this.showCameraPopup = !this.showCameraPopup;
  }
  loadDemandes(): void {
    this.demandeService.getAll().subscribe({
      next: (demandes) => {
        this.demandes = demandes;
      },
      error: (err) => {
        console.error('Failed to load demandes:', err);
      }
    });
  }
  

  onMapReady(map: L.Map): void {
    this.map = map;
    this.updateMapMarkers();
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if (this.map) {
            this.map.setView([this.userLocation.lat, this.userLocation.lng], 14);
          }
          this.updateUserMarker();
        },
        (error) => {
          console.error('Error getting user location:', error);
          this.error = 'Could not get your location. Using default view.';
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser.';
    }
  }

  updateUserMarker(): void {
    if (!this.userLocation) return;

    const userIcon = L.icon({
      iconUrl: '../../../assets/img/espace-reserve.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    if (this.userMarker) {
      this.userMarker.setLatLng([this.userLocation.lat, this.userLocation.lng]);
    } else {
      this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], {
        icon: userIcon,
        title: 'Your location'
      }).addTo(this.map);
    }
  }

  loadMapPoints(): void {
    this.isLoading = true;
    this.pointCollecteService.getPointsForMap().subscribe({
      next: (data) => {
        this.mapPoints = data.points;
        this.isLoading = false;
        this.updateMapMarkers();
      },
      error: (err) => {
        this.error = 'Failed to load collection points. Please try again later.';
        this.isLoading = false;
        console.error('Error loading map points:', err);
      }
    });
  }

  updateMapMarkers(): void {
    if (!this.map || !this.mapPoints.length) return;

    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== this.userMarker) {
        this.map.removeLayer(layer);
      }
    });

    const defaultIcon = L.icon({
      iconUrl: '../../../assets/img/louer.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.mapPoints.forEach(point => {
      const marker = L.marker([point.latitude, point.longitude], {
        title: point.name,
      }).addTo(this.map);

      marker.setIcon(defaultIcon);

      marker.on('click', () => {
        if (this.selectedPoint) {
          const prevMarker = this.findMarkerByPointId(this.selectedPoint.id);
          if (prevMarker) prevMarker.setIcon(defaultIcon);
        }

        this.selectedPoint = point;
        this.map.setView([point.latitude, point.longitude], 14);
        this.map.closePopup();
        marker.openPopup();
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup';

      const title = document.createElement('h4');
      title.textContent = point.name;
      popupContent.appendChild(title);

      const address = document.createElement('p');
      address.innerHTML = `<strong>Address:</strong> ${point.address}`;
      popupContent.appendChild(address);

      const phone = document.createElement('p');
      phone.innerHTML = `<strong>Phone:</strong> ${point.phone}`;
      popupContent.appendChild(phone);

      const hours = document.createElement('p');
      hours.innerHTML = `<strong>Hours:</strong> ${point.openingTime} - ${point.closingTime}`;
      popupContent.appendChild(hours);

      const status = document.createElement('p');
      status.innerHTML = `<strong>Status:</strong> ${point.status}`;
      popupContent.appendChild(status);

      marker.bindPopup(popupContent);
    });
  }

  findNearestPoint(): void {
    if (!this.userLocation) {
      alert('Please allow location access to find nearest collection point.');
      return;
    }

    this.isLoading = true;
    this.pointCollecteService.findNearestPointByCoords(
      this.userLocation.lat,
      this.userLocation.lng
    ).subscribe({
      next: (point) => {
        this.handleNearestPoint(point);
        this.showPointDetails(point);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleNearestPoint(point: PointCollecte): void {
    this.isLoading = false;
    if (this.map) {
      this.map.setView([point.latitude, point.longitude], 14);
      this.highlightPoint(point);
    }
  }

  private highlightPoint(point: PointCollecte): void {
    if (!this.map) return;

    if (this.nearestMarker) {
      this.map.removeLayer(this.nearestMarker);
    }

    this.nearestMarker = L.marker([point.latitude, point.longitude], {
      icon: L.icon({
        iconUrl: 'assets/img/epingle.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
    }).addTo(this.map);

    this.map.setView([point.latitude, point.longitude], 14);
  }

  private showPointDetails(point: PointCollecte): void {
    if (!this.map) return;

    const popupContent = document.createElement('div');
    popupContent.className = 'map-popup';

    const title = document.createElement('h4');
    title.textContent = point.adressePointCollecte;
    popupContent.appendChild(title);

    const address = document.createElement('p');
    address.innerHTML = `<strong>Address:</strong> ${point.adressePointCollecte}`;
    popupContent.appendChild(address);

    const phone = document.createElement('p');
    phone.innerHTML = `<strong>Phone:</strong> ${point.numTelephonePointCollecte}`;
    popupContent.appendChild(phone);

    const hours = document.createElement('p');
    hours.innerHTML = `<strong>Hours:</strong> ${point.heureOuverturePointCollecte} - ${point.heureFermeturePointCollecte}`;
    popupContent.appendChild(hours);

    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${point.disponibilitePointCollecte}`;
    popupContent.appendChild(status);

    if (point.idPointCollecte) {
      const directionsBtn = document.createElement('button');
      directionsBtn.className = 'btn btn-sm btn-primary mt-2';
      directionsBtn.textContent = 'Get Directions';
      directionsBtn.onclick = () => this.getDirections(point.idPointCollecte);
      popupContent.appendChild(directionsBtn);
    }

    L.popup()
      .setLatLng([point.latitude, point.longitude])
      .setContent(popupContent)
      .openOn(this.map);
  }

  private findMarkerByPointId(id: number): L.Marker | null {
    let foundMarker: L.Marker | null = null;
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== this.userMarker) {
        if ((layer.options as any).pointId === id) {
          foundMarker = layer;
        }
      }
    });
    return foundMarker;
  }

  getDirections(pointId?: number): void {
    if (!this.userLocation) {
      alert('Please allow location access.');
      return;
    }
    if (!pointId) {
      console.error('No point ID provided');
      return;
    }

    this.pointCollecteService.getDirections(
      this.userLocation.lat,
      this.userLocation.lng,
      pointId
    ).subscribe({
      next: (response) => {
        window.open(response.directions, '_blank');
      },
      error: (err) => {
        console.error('Error getting directions:', err);
        alert('Failed to get directions.');
      }
    });
  }

  confirmPickup(): void {
    if (!this.selectedPoint || !this.selectedDemande || !this.selectedDemande.idDemandeRecyclage) {
      return; // Exit if any required value is missing
    }
  
    if (this.selectedDemande.etatDemandeRecyclage !== Etat.TRAITE) {
      alert('You cannot schedule pickup for a demande that is not treated.');
      return;
    }
  
    this.pickupLoading = true;
    this.scheduleMessage = null;
  
    this.collecteService.planCollecte(
      this.selectedDemande.idDemandeRecyclage, // Now guaranteed to be a number
      this.selectedPoint.id
    ).subscribe({
      next: () => {
        this.scheduleSuccess = true;
        this.scheduleMessage = 'Pickup successfully scheduled!';
        this.pickupLoading = false;
      },
      error: (error) => {
        console.error('Error scheduling pickup:', error);
        this.scheduleSuccess = false;
        this.scheduleMessage = 'Failed to schedule pickup. Try again later.';
        this.pickupLoading = false;
      }
    });
  }
  
  
  
  // Example helper to get demandeId, adapt it to your logic
  private getCurrentDemandeId(): number {
    // TODO: retrieve dynamically from localstorage, auth service, etc.
    const demandeId = localStorage.getItem('demandeId');
    if (!demandeId) throw new Error('Demande ID not found');
    return parseInt(demandeId, 10);
  }
  

  private handleError(err: any): void {
    this.isLoading = false;
    console.error('Error finding nearest point:', err);
    this.error = err.message || 'Could not find nearest collection point.';
  }
}
