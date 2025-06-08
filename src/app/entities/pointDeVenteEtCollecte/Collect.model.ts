export interface Collecte {
    idCollecte: number;
    dateCollecte: string;         
    heureDebutCollecte: string;   
    heureFinCollecte: string;      
    scheduled: boolean;
    demandeRecyclage: {
      idDemandeRecyclage: number;
      title: string;
    };
    pointCollecte: {
      idPointCollecte: number;
      adressePointCollecte: string;
    };
    vehicule: {
      idVehicule: number;
      marqueVehicule: string;
      modeleVehicule: string;
    };


  }

  