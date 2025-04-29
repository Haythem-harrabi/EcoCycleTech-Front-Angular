// ✅ src/app/models/reclamation.model.ts
export interface Reclamation {
  idReclamation?: number;
  titreReclamation: string;
  descriptionReclamation: string;
  dateReclamation?: Date | string;
  etatReclamation: 'EN_ATTENTE' | 'TRAITEE' | 'REJETEE';
  user?: {
    idUser: number;
  };
}
