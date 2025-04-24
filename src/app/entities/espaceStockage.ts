import { Fichier } from "./fichier";
import { PlanStockage } from "./planStockage";
import { User } from "./user";

export enum StatutEspace {
    ACTIVE = 'Active',
    BLOCKED = 'Blocked',
    EXPIRED = 'Expired'
  }
  

export class EspaceStockage {
    idEspace: number;
    usedTaille: number; // Using number instead of BigDecimal
    prix: number;
    dateExpiration: Date;
    dateCreation : Date;
    statut: StatutEspace;
    fichiers: Fichier[];



    constructor(
        idEspace: number,
        usedTaille: number,
        prix: number,
        dateExpiration: Date,
        dateCreation: Date,
        statut: StatutEspace,
        fichiers: Fichier[] = [],
      ) {
        this.idEspace = idEspace;
        this.usedTaille = usedTaille;
        this.prix = prix;
        this.dateExpiration = new Date(dateExpiration);
        this.dateCreation = new Date(dateCreation);
        this.statut = statut;
        this.fichiers = fichiers;
      }
   
    

      isActive(): boolean {
        return this.statut === StatutEspace.ACTIVE && 
               new Date(this.dateExpiration) > new Date();
    }

    // getRemainingSpace(): number {
    //     return this.planStockage!.tailleMax - this.usedTaille;
    // }

    isExpired(): boolean {
        return new Date() > this.dateExpiration;
      }

      // get usagePercentage(): number {
      //   return (this.usedTaille / this.planStockage!.tailleMax) * 100;
      // }

      get isBlocked(): boolean {
        return this.statut === StatutEspace.BLOCKED;
      }

}