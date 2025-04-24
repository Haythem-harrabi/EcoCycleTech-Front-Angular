import { DemandeRecyclage } from './demande-recyclage.model';

export class CertificatRecyclage {
  idCertificatRecyclage!: number;
  dateEmissionCertificat!: Date;
  demandeRecyclage?: DemandeRecyclage;
}
