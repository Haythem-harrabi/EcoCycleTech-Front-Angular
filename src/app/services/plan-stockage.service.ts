import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanStockage } from '../entities/planStockage';

@Injectable({
  providedIn: 'root'
})
export class PlanStockageService {


  private baseUrl = 'http://localhost:8082/ecoCycleTech/planstockage';

  constructor(private http : HttpClient ) { }

  getPlans(): Observable<PlanStockage[]> {
    return this.http.get<PlanStockage[]>(`${this.baseUrl}/getAllPlans`);
  }

  AddPlan(p:PlanStockage):Observable<PlanStockage[]>{
    return this.http.post<PlanStockage[]>(this.baseUrl+'/addPlan',p)
  }

  getPlanById(id: number) {
    return this.http.get<PlanStockage>(this.baseUrl+ '/getPlan/'+ id)
  }


  UpdatePlan(id:number, p:PlanStockage):Observable<PlanStockage[]>{
      return this.http.put<PlanStockage[]>(this.baseUrl+'/updatePlan/'+id,p)
    }



  DeletePlan(id: number):Observable<PlanStockage[]>{
    return this.http.delete<PlanStockage[]>(this.baseUrl+'/deletePlan/' +id)
  }

}
