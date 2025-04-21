import { Etat } from '../enumerations/etat.model';
import { CertificatRecyclage } from './certificat-recyclage.model';

export class DemandeRecyclage {
  idDemandeRecyclage: number;
  dateCreationDemandeRecyclage: Date;
  descriptionDemandeRecyclage: string;
  nbrAppareils: number;
  etatDemandeRecyclage: Etat;
  prixDemandeRecyclage: number;
  certificatRecyclage?: CertificatRecyclage;
  imageData?: string;
 // user: User | null; // Assuming the user can be null, you can replace it with proper model
 // collecte: Collecte | null;
  constructor(
    idDemandeRecyclage: number,
    dateCreationDemandeRecyclage: Date,
    descriptionDemandeRecyclage: string,
    nbrAppareils: number,
    etatDemandeRecyclage: Etat,
    prixDemandeRecyclage: number,
    imageData: string,
    certificatRecyclage?: CertificatRecyclage
  ) {
    this.idDemandeRecyclage = idDemandeRecyclage;
    this.dateCreationDemandeRecyclage = dateCreationDemandeRecyclage;
    this.descriptionDemandeRecyclage = descriptionDemandeRecyclage;
    this.nbrAppareils = nbrAppareils;
    this.etatDemandeRecyclage = etatDemandeRecyclage;
    this.prixDemandeRecyclage = prixDemandeRecyclage;
    this.certificatRecyclage = certificatRecyclage;
  }
}
