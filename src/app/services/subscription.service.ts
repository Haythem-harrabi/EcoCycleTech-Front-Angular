import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../entities/subscription';
import { EspaceStockage } from '../entities/espaceStockage';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = 'http://localhost:8090/ecoCycleTech/subscription';

  constructor(private http: HttpClient) {}

  // Get all subscriptions
  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/getAllSubscriptions`);
  }

  // Get a single subscription by ID
  getSubscription(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.baseUrl}/getSubscription/${id}`);
  }

  // Add a new subscription
  addSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/addSubscription`, subscription);
  }

  // Update an existing subscription
  updateSubscription(id: number, subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.baseUrl}/updateSubscription/${id}`, subscription);
  }

  // Delete a subscription
  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteSubscription/${id}`);
  }


  getUserSpace(id: number): Observable<EspaceStockage> {
    return this.http.get<EspaceStockage>(`${this.baseUrl}/activeEspace/${id}`);
  }


  getSubscriptionByEspace(id : number):Observable<Subscription> {
    return this.http.get<Subscription>(`${this.baseUrl}/getSubscriptionByEspace/${id}`);
  }
}
