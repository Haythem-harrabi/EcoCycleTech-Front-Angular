import { EspaceStockage } from "./espaceStockage";

export class PlanStockage {
    idPlan: number;
    titre: string;
    tailleMax: number; 
    prix: number;
    premium ?: boolean;
    espaces: EspaceStockage[];
    
  
    constructor(
      idPlan: number = 0,
      titre: string = '',
      tailleMax: number = 0,
      prix: number = 0,
      premium : boolean ,
      espaces: EspaceStockage[] = []
    ) {
      this.idPlan = idPlan;
      this.titre = titre;
      this.tailleMax = tailleMax;
      this.prix = prix;
      this.premium= premium
      this.espaces = espaces;
    }
  
    
    static fromJson(json: any): PlanStockage {
      return new PlanStockage(
        json.idPlan || 0,
        json.titre || '',
        json.tailleMax || 0,
        json.prix || 0,
        json.espaces || []
      );
    }
  
    
    toJson(): any {
      return {
        idPlan: this.idPlan,
        titre: this.titre,
        tailleMax: this.tailleMax,
        prix: this.prix,
        espaces: this.espaces
      };
    }
}