export class User{

    idUser ?: number;
nom !: string;
prenom !: string
username ?:string



constructor(id?: number, username ?: string) {
    this.idUser = id;
    this.username = username;
  }

}