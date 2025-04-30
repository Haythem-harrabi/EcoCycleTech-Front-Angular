import { Evenement } from './evenement.model';
import { User } from './user.model';

export class TicketEvenement {
  idTicketEvenement: number;
  evenement: Evenement;
  dateAchat: Date;
  user: User;
  qrCodeUrl: string;

  constructor(idTicketEvenement: number, evenement: Evenement, dateAchat: Date, user: User, qrCodeUrl: string) {
    this.idTicketEvenement = idTicketEvenement;
    this.evenement = evenement;
    this.dateAchat = dateAchat;
    this.user = user;
    this.qrCodeUrl = qrCodeUrl;
  }
} 