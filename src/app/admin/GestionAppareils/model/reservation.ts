import { User } from "../../models/user";
import { Appareil } from './appareil';

export class Reservation {
  idReservation: number;
  statut: string;
  total: number;
  date: Date;
  idUser: number;
  panier: Appareil[];

  constructor(
    idReservation: number,
    statut: string,
    total: number,
    date: Date,
    idUser: number,
    panier: Appareil[]
  ) {
    this.idReservation = idReservation;
    this.statut = statut;
    this.total = total;
    this.date = date;
    this.idUser = idUser;
    this.panier = panier;
  }
}
