import { Evenement } from './evenement.model';
import { User } from '../../models/user';

/*export class TicketEvenement {
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
}}*/
export class TicketEvenement {


//   idTicketEvenement?: number;
//   evenement?: {
//     idEvenement: number;
//     nomEvenement: string;
//     dateEvenement: Date;
//     prixEvenement?: number;
//   };
//   user?: {
//     id: number;
//     username?: string;
//     lastName?: string;
//     email?: string;
//   };
//   dateAchat: Date;
//   qrCodeUrl?: string;
private _idTicketEvenement?: number;
  private _evenement?: {
    idEvenement: number;
    nomEvenement: string;
    dateEvenement: Date;
    localisationEvenement: string;
    provenanceEvenement: string;
    nbrPlacesEvenement: number;
    prixEvenement: number;
    aftermovie: any;
  };
  private _user?: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    username: string;
    numTelephone: number;
    dateNaissance: string;
    adresse: string;
    role: string;
    photoDeProfil: any;
    password: string;
    status: any;
    emailVerified: boolean;
    espace: any;
    forgotPassword: any;
    active: boolean;
    authorities: { authority: string }[];
    banned: boolean;
  };
   _dateAchat: Date;
  private _qrCodeUrl?: string;



  constructor(data: any = {}) {
    this._idTicketEvenement = data.idTicketEvenement;
    this._evenement = data.evenement ? {
      idEvenement: data.evenement.idEvenement,
      nomEvenement: data.evenement.nomEvenement,
      dateEvenement: new Date(data.evenement.dateEvenement),
      localisationEvenement: data.evenement.localisationEvenement,
      provenanceEvenement: data.evenement.provenanceEvenement,
      nbrPlacesEvenement: data.evenement.nbrPlacesEvenement,
      prixEvenement: data.evenement.prixEvenement,
      aftermovie: data.evenement.aftermovie
    } : undefined;

    this._user = data.user ? {
      idUser: data.user.idUser,
      nom: data.user.nom,
      prenom: data.user.prenom,
      email: data.user.email,
      username: data.user.username,
      numTelephone: data.user.numTelephone,
      dateNaissance: data.user.dateNaissance,
      adresse: data.user.adresse,
      role: data.user.role,
      photoDeProfil: data.user.photoDeProfil,
      password: data.user.password,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
      espace: data.user.espace,
      forgotPassword: data.user.forgotPassword,
      active: data.user.active,
      authorities: data.user.authorities || [],
      banned: data.user.banned
    } : undefined;

    this._dateAchat = new Date(data.dateAchat);
    this._qrCodeUrl = data.qrCodeUrl;
  }

  // Getters
  get idTicketEvenement(): number | undefined {
    return this._idTicketEvenement;
  }

  get evenement(): any | undefined {
    return this._evenement;
  }

  get user(): any | undefined {
    return this._user;
  }

  get dateAchat(): Date {
    return this._dateAchat;
  }

  get qrCodeUrl(): string | undefined {
    return this._qrCodeUrl;
  }

  // Setters
  set idTicketEvenement(value: number | undefined) {
    this._idTicketEvenement = value;
  }

  set evenement(value: any | undefined) {
    this._evenement = value;
  }

  set user(value: any | undefined) {
    this._user = value;
  }

  set dateAchat(value: Date) {
    this._dateAchat = value;
  }

  set qrCodeUrl(value: string | undefined) {
    this._qrCodeUrl = value;
  }
}
