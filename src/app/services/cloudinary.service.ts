import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
private baseUrl = 'http://localhost:8090/ecoCycleTech/cloudinary';
  
    constructor(private http : HttpClient ) { }
    

    uploadFile(file: File, folder: string): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return this.http.post(`${this.baseUrl}/upload`, formData);
    }
  
    deleteFile(publicId: string, resourceType: string): Observable<any> {
      const params = new HttpParams()
        .set('publicId', publicId)
        .set('type', resourceType);
      
      return this.http.delete(`${this.baseUrl}/delete`, { params });
    }
    
  
    createFolder(folderPath: string): Observable<any> {
      const params = new HttpParams().set('folder', folderPath);
      return this.http.post(`${this.baseUrl}/create-folder`, null, { params });
    }
  
    getFolderContents(folderPath: string): Observable<any> {
      const params = new HttpParams().set('folder', folderPath);
      return this.http.get(`${this.baseUrl}/list`, { params });
    }

    deleteFolder(path: string): Observable<any> {
      const params = new HttpParams().set('folder', path);
      return this.http.delete(`${this.baseUrl}/delete-folder`, { params });
    }
  
    
}
