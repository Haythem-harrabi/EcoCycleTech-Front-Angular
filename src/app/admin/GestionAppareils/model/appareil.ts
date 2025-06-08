import { EtatAppareilEnum } from './etat-appareil.enum'; // Vous avez déjà cette énumération
import { Avis } from './avis'; // Assurez-vous que la classe Avis est importée

export class Appareil {
  idAppareil: number;
  nom: string;
  categorie: string;
  etatAppareil: EtatAppareilEnum;
  marque: string;
  prix: number;
  description: string;
  imageurl: string;
  avis: Avis[];  // Liste des avis

  constructor(
    idAppareil: number,
    nom: string,
    categorie: string,
    etatAppareil: EtatAppareilEnum,
    marque: string,
    prix: number,
    description: string,
    imageurl: string,
    avis: Avis[] = []
  ) {
    this.idAppareil = idAppareil;
    this.nom = nom;
    this.categorie = categorie;
    this.etatAppareil = etatAppareil;
    this.marque = marque;
    this.prix = prix;
    this.description = description;
    this.imageurl = imageurl;
    this.avis = avis;  // Initialiser avec un tableau vide ou une valeur fournie
  }
}
