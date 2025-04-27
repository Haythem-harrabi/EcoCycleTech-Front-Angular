import { TicketEvenement } from './ticket-evenement.model';

export class Evenement {
  idEvenement: number;
  nomEvenement: string;
  dateEvenement: Date;
  localisationEvenement: string;
  nbrPlacesEvenement: number;
  prixEvenement: number;
  aftermovie: string;
  provenanceEvenement: string;
  ticketEvenementList?: TicketEvenement[];

  constructor() {
    this.idEvenement = 0;
    this.nomEvenement = '';
    this.dateEvenement = new Date();
    this.localisationEvenement = '';
    this.nbrPlacesEvenement = 0;
    this.prixEvenement = 0;
    this.aftermovie = '';
    this.provenanceEvenement = '';
    this.ticketEvenementList = [];
  }
} 