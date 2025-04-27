import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${user.idUser}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for specific user actions
  banUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/ban`, {});
  }

  unbanUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/unban`, {});
  }

  activateUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/deactivate`, {});
  }

  // Statistics methods
  getUserAgeStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/age`);
  }

  getUserRegistrationStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/registration`);
  }
}