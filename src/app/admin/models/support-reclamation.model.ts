export interface SupportReclamation {
    idSupportReclamation?: number;
    idResponsable: number;
    nomResponsable: string;
    dateOuvertureSupport: Date | string;
    dateClotureSupport?: Date | string;
    reclamation?: { idReclamation: number }; 
  }