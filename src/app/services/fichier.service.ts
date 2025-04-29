import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fichier } from '../entities/fichier';
// import * as Mammoth from 'mammoth'; // For DOCX files
// import * as pdfjsLib from 'pdfjs-dist'; // For PDF files

@Injectable({
  providedIn: 'root'
})
export class FichierService {


    private baseUrl = 'http://localhost:8090/ecoCycleTech/fichier';
  
    constructor(private http : HttpClient ) { }
    
    getFichiers(): Observable<Fichier[]> {
      return this.http.get<Fichier[]>(`${this.baseUrl}/getAllFichiers`);
    }
  
    AddFichier(p:Fichier):Observable<Fichier>{
      return this.http.post<Fichier>(this.baseUrl+'/addFichier',p)
    }
  
    getFichierById(id: number) {
      return this.http.get<Fichier>(this.baseUrl+ '/getFichier/'+ id)
    }
  
  
    UpdateFichier(id:number, p:Fichier):Observable<Fichier[]>{
        return this.http.put<Fichier[]>(this.baseUrl+'/updateFichier/'+id,p)
      }
   
  
  
    DeleteFichier(id: number):Observable<Fichier[]>{
      return this.http.delete<Fichier[]>(this.baseUrl+'/deleteFichier/' +id)
    }

    getFichierByPublicId(publicId: string) {
       const params = new HttpParams().set('publicId', publicId);
      return this.http.get<Fichier>(this.baseUrl+ '/getFichierByPublicId', {params})
    }



    fetchFileAsBlob(fileUrl: string): Observable<Blob> {
      return this.http.get(fileUrl, { responseType: 'blob' });
    }
  
    analyzeFile(formData: FormData): Observable<any> {
      return this.http.post(this.baseUrl+'/analyze', formData);
    }

  

    
}
