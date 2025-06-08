export interface PointCollecte {
  idPointCollecte?: number;
  adressePointCollecte: string;
  numTelephonePointCollecte: string;
  emailPointCollecte: string;
  heureOuverturePointCollecte: string;
  heureFermeturePointCollecte: string;
  capacitePointCollecte: number;
  disponibilitePointCollecte: 'DISPONIBLE' | 'SATUREE' | 'INDISPONIBLE';
  latitude: number;
  longitude: number;
  availableDays: string[];
  location?: string;
}
  
  export interface MapPoint {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: number;
    email: string;
    openingTime: string;
    closingTime: string;
    capacity: number;
    status: string;
    availableDays: string[];
  }
  
  export interface DirectionsResponse {
    directions: string;
    point: PointCollecte;
  }
  
  export interface SchedulePickupResponse {
    success: boolean;
    message: string;
    scheduledTime: string;
    collectionPoint: PointCollecte;
  }