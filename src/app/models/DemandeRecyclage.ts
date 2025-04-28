import { Etat } from '../enumerations/Etat';
import { CertificatRecyclage } from './CertificatRecyclage';

export class DemandeRecyclage {
  idDemandeRecyclage!: number| null;
  title!: string | null;
  dateCreationDemandeRecyclage!: Date| null;
  descriptionDemandeRecyclage!: string| null;
  nbrAppareils!: number;
  etatDemandeRecyclage!: Etat| null;
  prixDemandeRecyclage!: number;
  imageData?: string| null;
  imageBase64?: string| null;
  certificatRecyclage?: CertificatRecyclage| null;
}