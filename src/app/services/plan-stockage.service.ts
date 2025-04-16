import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanStockage } from '../entities/planStockage';

@Injectable({
  providedIn: 'root'
})
export class PlanStockageService {

  private baseUrl = 'http://localhost:8090/ecoCycleTech/planstockage';

  constructor(private http : HttpClient ) { }
  
  getPlans(): Observable<PlanStockage[]> {
    return this.http.get<PlanStockage[]>(`${this.baseUrl}/getAllPlans`);
  }

  AddPlan(p:PlanStockage):Observable<PlanStockage[]>{
    return this.http.post<PlanStockage[]>(this.baseUrl+'/addPlan',p)
  }
 
  // GetProductById(id:number):Observable<PlanStockage>{
  //   return this.http.get<PlanStockage>('http://localhost:3000/products/'+ id)
  // }

  // DeleteProduct(id: number):Observable<PlanStockage[]>{
  //   return this.http.delete<PlanStockage[]>('http://localhost:3000/products/'+ id)
  // }

  // UpdateProduct(id:number, p:PlanStockage):Observable<PlanStockage[]>{
  //   return this.http.put<PlanStockage[]>('http://localhost:3000/products/'+id,p)
  // }
}
