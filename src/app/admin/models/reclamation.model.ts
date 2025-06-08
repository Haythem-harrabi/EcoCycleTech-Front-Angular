export interface Reclamation {
  idReclamation?: number;
  titreReclamation: string;
  descriptionReclamation: string;
  dateCreation: Date | string; // Backend-compatible format
  dateReclamation?: Date | string;
  etatReclamation: 'EN_ATTENTE' | 'TRAITEE' | 'REJETEE' | 'NONAFFECTEE'|'URGENT';
  
  user?: {
    idUser: number;
  };
}