export class User {
  idUser: number;
  username: string;
  email: string;
nom: string;
prenom: string;
numTelephone: number;
dateNaissance?: Date;
adresse: string;
role: number;
password: string;
photoDeProfil!: string ;
  constructor(idUser: number, username: string, email: string,nom: string,
    prenom: string,
    numTelephone: number,
    dateNaissance: Date,
    adresse: string,
    role: number,
    password: string) {
    this.idUser = idUser;
    this.username = username;
    this.email = email;
    this.nom = nom;
    this.prenom = prenom;
    this.numTelephone = numTelephone;
    this.dateNaissance = dateNaissance;
    this.adresse = adresse;
    this.role = role;
    this.password = password;
  }
}