import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EspaceStockage } from '../entities/espaceStockage';

@Injectable({
  providedIn: 'root'
})
export class EspaceStockageService {


    private baseUrl = 'http://localhost:8082/ecoCycleTech/espacestockage';

    constructor(private http : HttpClient ) { }

    getEspaces(): Observable<EspaceStockage[]> {
      return this.http.get<EspaceStockage[]>(`${this.baseUrl}/getAllEspaces`);
    }

    AddEspace(p:EspaceStockage):Observable<EspaceStockage>{
      return this.http.post<EspaceStockage>(this.baseUrl+'/addEspace',p)
    }

    getEspaceById(id: number) {
      return this.http.get<EspaceStockage>(this.baseUrl+ '/getEspace/'+ id)
    }

    getEspacesByPlan(id: number) {
      return this.http.get<EspaceStockage[]>(this.baseUrl+ '/getEspacesByPlan/'+ id)
    }


    UpdateEspace(id:number, p:EspaceStockage):Observable<EspaceStockage[]>{
        return this.http.put<EspaceStockage[]>(this.baseUrl+'/updateEspace/'+id,p)
      }



    DeleteEspace(id: number):Observable<EspaceStockage[]>{
      return this.http.delete<EspaceStockage[]>(this.baseUrl+'/deleteEspace/' +id)
    }

    blockSpace(id: number): Observable<EspaceStockage> {
      return this.http.put<EspaceStockage>(`${this.baseUrl}/blockEspace/${id}`, {});
    }
    unblockSpace(id: number): Observable<EspaceStockage> {
      return this.http.put<EspaceStockage>(`${this.baseUrl}/unblockEspace/${id}`, {});
    }

    getOccupiedSpace(id : number): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/getOccupiedSpace/${id}`, {});
    }
}
