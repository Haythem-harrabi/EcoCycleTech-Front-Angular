import { User } from './user';
import { Appareil } from './appareil';

export class Reservation {
  idReservation: number;
  statut: string;
  total: number;
  date: Date;
  user: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
  };
  panier: Appareil[];

  constructor(
    idReservation: number,
    statut: string,
    total: number,
    date: Date,
    user: User,
    panier: Appareil[]
  ) {
    this.idReservation = idReservation;
    this.statut = statut;
    this.total = total;
    this.date = date;
    this.user = user;
    this.panier = panier;
  }
}
