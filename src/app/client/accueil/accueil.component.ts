import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { DemandeRecyclage } from 'src/app/entities/demanderecyclage/demande-recyclage.model';
import { Etat } from 'src/app/entities/enumerations/etat.model';
import { MapPoint, PointCollecte } from 'src/app/entities/pointDeVenteEtCollecte/point-de-collect';
import { DemandeRecyclageService } from 'src/app/services/demande-recyclage/demande-recyclage.service';
import { CollecteService } from 'src/app/services/pointDeVenteEtCollecte/collecte.service';
import { PointCollecteService } from 'src/app/services/pointDeVenteEtCollecte/point-de-collect.service';
import Swal from 'sweetalert2';
import { AuthService } from '../UserManagement/services/auth.service';
import Typed from 'typed.js';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  private map!: L.Map;
  private userMarker!: L.Marker;
  private nearestMarker: L.Marker | null = null;
  currentUserId: number | null;
  isAdmin = false;
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
  demandes: DemandeRecyclage[] = []; 
  selectedDemande: DemandeRecyclage | null = null; 
  private markersMap = new Map<number, L.Marker>();


  basicMapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      })
    ],
    zoom: 13,
    center: L.latLng(36.8065, 10.1815)
  };

   @ViewChild('typedElement', { static: true }) typedElement!: ElementRef;

@ViewChild('servicesSection') servicesSection!: ElementRef;

  services = [
    { image: 'assets/img/carousel-recycle.webp', title: 'Recycling electronics', description: 'Giving a second life to your electronic devices.' },
    { image: 'assets/img/carousel-store.jpg', title: 'Electronics Store', description: 'Buy any new or refurbished electronic device with a suitable price.' },
    { image: 'assets/img/carousel-data.jpg', title: 'Securing data', description: 'Keep your data safe with our data-hosting platform Eco-Drive' },
    { image: 'assets/img/carousel-event.webp', title: 'Events', description: 'Help save our environment and raise awareness by participating in our events at low prices.' }
    // Add more items as needed
  ];
  
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    }
  ];


  scrollToServices() {
  this.servicesSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

  constructor(private pointCollecteService: PointCollecteService, private collecteService: CollecteService,
    private demandeService: DemandeRecyclageService ,  private authService : AuthService


  ) {    this.currentUserId = this.authService.getUserId();
    const u = this.authService.getCurrentUser();
    this.isAdmin = u?.role === 'ADMIN';}

  ngOnInit(): void {
    this.loadMapPoints();
    this.getUserLocation();
    this.loadDemandes(); 


     const options = {
      strings: [
        "Recycle Today, Reimagine Tomorrow 🌱"
      ],
      typeSpeed: 120,
      backSpeed: 50,
      loop: false,
      showCursor: true,
      cursorChar: '',
      startDelay: 500
    };

    new Typed(this.typedElement.nativeElement, options);

  }
  openCameraPopup() {
    this.showCameraPopup = true;
  }
  
  closeCameraPopup() {
    this.showCameraPopup = false;
  }
  filteredDemandes: DemandeRecyclage[] = [];

  private loadDemandes(): void {
    this.demandeService.getAll().subscribe(all => {
      // only keep the ones whose .user.idUser matches the logged-in user
      this.demandes = all.filter(d => d.user?.idUser === this.currentUserId);
      this.filteredDemandes = [...this.demandes];
    });
  }
  
  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 100);
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.map.setView([this.userLocation.lat, this.userLocation.lng], 14);
          this.updateUserMarker();
        },
        () => { this.error = 'Could not get your location.'; }
      );
    }
  }

  updateUserMarker(): void {
    if (!this.userLocation) return;

    const userIcon = L.icon({
      iconUrl: '../../../assets/img/espace-reserve.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon }).addTo(this.map);
  }

  loadMapPoints(): void {
    this.pointCollecteService.getPointsForMap().subscribe({
      next: (data) => {
        this.mapPoints = data.points;
        this.updateMapMarkers();
      },
      error: (err) => {
        this.error = 'Failed to load points.';
      }
    });
  }

  updateMapMarkers(): void {
    if (!this.map || !this.mapPoints.length) return;
  
    // Clear previous non-user markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== this.userMarker) {
        this.map.removeLayer(layer);
      }
    });
  
    this.markersMap.clear(); // Clear stored markers
  
    const defaultIcon = L.icon({
      iconUrl: '../../../assets/img/louer.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  
    this.mapPoints.forEach(point => {
      const marker = L.marker([point.latitude, point.longitude], { icon: defaultIcon }).addTo(this.map);
  
      this.markersMap.set(point.id, marker); // Store marker by ID
  
      const popupHtml = `
        <div class="map-popup">
          <h4>${point.name}</h4>
          <p><strong>Address:</strong> ${point.address}</p>
          <p><strong>Phone:</strong> ${point.phone}</p>
          <p><strong>Hours:</strong> ${point.openingTime} - ${point.closingTime}</p>
          <p><strong>Status:</strong> ${point.status}</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="window.dispatchEvent(new CustomEvent('getDirections', { detail: ${point.id} }))">Get Directions</button>
        </div>
      `;
  
      marker.bindPopup(popupHtml);
  
      marker.on('click', () => {
        if (this.selectedPoint) {
          const prevMarker = this.findMarkerByPointId(this.selectedPoint.id);
          if (prevMarker) prevMarker.setIcon(defaultIcon);
        }
  
        this.selectedPoint = point;
        this.map.setView([point.latitude, point.longitude], 14);
        marker.openPopup();
      });
    });
  
    window.addEventListener('getDirections', (e: any) => {
      this.getDirections(e.detail);
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
    this.selectedPoint = {
      id: point.idPointCollecte!,
      name: `Point #${point.idPointCollecte}`, // or use point.adressePointCollecte if more descriptive
      email: point.emailPointCollecte,
      latitude: point.latitude,
      longitude: point.longitude,
      address: point.adressePointCollecte,
      phone: Number(point.numTelephonePointCollecte),
      openingTime: point.heureOuverturePointCollecte,
      closingTime: point.heureFermeturePointCollecte,
      capacity: point.capacitePointCollecte,
      availableDays: point.availableDays || [],
      status: point.disponibilitePointCollecte
    };
    
    
  
    const marker = this.markersMap.get(point.idPointCollecte!);
    if (marker) {
      this.map.setView([point.latitude, point.longitude], 14);
      marker.openPopup();
    } else {
      this.highlightPoint(point);
      this.showPointDetails(point);
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
      directionsBtn.onclick = () => this.getDirections(point.idPointCollecte!);
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

  getDirections(pointId: number): void {
    if (!this.userLocation) {
      Swal.fire('Error', 'Please allow location access.', 'error');
      return;
    }
    this.pointCollecteService.getDirections(this.userLocation.lat, this.userLocation.lng, pointId).subscribe({
      next: (response) => window.open(response.directions, '_blank'),
      error: () => Swal.fire('Error', 'Failed to get directions.', 'error')
    });
  }

  confirmPickup(): void {
    if (!this.selectedPoint || !this.selectedDemande || !this.selectedDemande.idDemandeRecyclage) return;

    if (this.selectedDemande.etatDemandeRecyclage !== Etat.TRAITE) {
      Swal.fire('Cannot Schedule', 'This demande is not yet treated.', 'warning');
      return;
    }

    this.pickupLoading = true;
    this.collecteService.planCollecte(this.selectedDemande.idDemandeRecyclage, this.selectedPoint.id)
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Pickup successfully scheduled!', 'success');
          this.pickupLoading = false;
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Failed', 'Pickup scheduling failed. Check if vehicle is available.', 'error');
          this.pickupLoading = false;
        }
      });
  }

  
  

  private handleError(err: any): void {
    this.isLoading = false;
    console.error('Error finding nearest point:', err);
    this.error = err.message || 'Could not find nearest collection point.';
  }
}
