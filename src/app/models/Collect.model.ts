export interface Collecte {
    idCollecte: number;
    dateCollecte: string;         // Format: 'yyyy-MM-dd'
    heureDebutCollecte: string;    // Format: 'HH:mm:ss'
    heureFinCollecte: string;      // Format: 'HH:mm:ss'
    scheduled: boolean;
    demandeRecyclage: {
      idDemandeRecyclage: number;
      // You can add more fields if needed
    };
    pointCollecte: {
      idPointCollecte: number;
      // You can add more fields if needed
    };
    vehicule: {
      idVehicule: number;
      // You can add more fields if needed
    };
  }
  