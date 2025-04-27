import { Etat } from '../enumerations/etat.model';
import { CertificatRecyclage } from './certificat-recyclage.model';

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
