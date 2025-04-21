import { DemandeRecyclage } from './demande-recyclage.model';
export class CertificatRecyclage {
    idCertificatRecyclage: number;
    dateEmissionCertificat: Date;
    demandeRecyclage?: DemandeRecyclage;
  
    constructor(
      idCertificatRecyclage: number,
      dateEmissionCertificat: Date,
      demandeRecyclage?: DemandeRecyclage
    ) {
      this.idCertificatRecyclage = idCertificatRecyclage;
      this.dateEmissionCertificat = dateEmissionCertificat;
      this.demandeRecyclage = demandeRecyclage;
    }
  }