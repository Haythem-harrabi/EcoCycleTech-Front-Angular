import { Reservation } from './reservation';

export class Facture {
  idFacture: number;
  montant: number;
  dateFacture: Date;
  pdfUrl: string;
  reservation: Reservation;
  reference?: string;
  paymentMethod?: string;
  status?: string;

  constructor(
    idFacture: number,
    montant: number,
    dateFacture: Date,
    pdfUrl: string,
    reservation: Reservation,
    reference?: string,
    paymentMethod: string = 'Stripe',
    status: string = 'PAID'
  ) {
    this.idFacture = idFacture;
    this.montant = montant;
    this.dateFacture = dateFacture;
    this.pdfUrl = pdfUrl;
    this.reservation = reservation;
    this.reference = reference;
    this.paymentMethod = paymentMethod;
    this.status = status;
  }
}