import { EspaceStockage } from "./espaceStockage";


export enum TypeFichier{
    IMAGE,
    VIDEO,
    DOCUMENT,
    AUDIO   
}
export enum ExtensionFichier{
  PDF,
  DOCX,
  TXT,
  PNG,
  JPG,
  JPEG,
  MP4
}
export class Fichier{
  idFichier!: number;
  nom!: string;
  taille!: number;
  dateUpload!: Date;
  urlStockage!: string;
  espace!: EspaceStockage
  type!: TypeFichier; 
  extension !: ExtensionFichier
  cloudinaryPublicId!: string;




  constructor(
    idFichier: number,
    nom: string,
    taille: number,
    dateUpload: Date,
    urlStockage: string,
    espace: EspaceStockage,
    type: TypeFichier,
    extension: ExtensionFichier,
    cloudinaryPublicId: string
  ) {
    this.idFichier = idFichier;
    this.nom = nom;
    this.taille = taille;
    this.dateUpload = dateUpload;
    this.urlStockage = urlStockage;
    this.espace = espace;
    this.type = type;
    this.extension = extension;
    this.cloudinaryPublicId = cloudinaryPublicId;
  }
  
}






