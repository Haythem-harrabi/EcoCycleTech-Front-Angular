import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PointCollecte, MapPoint, DirectionsResponse, SchedulePickupResponse } from '../models/point-de-collect';

@Injectable({
  providedIn: 'root'
})
export class PointCollecteService {
  private baseUrl = 'http://localhost:8090/ecoCycleTech/PointCollect';

  constructor(private http: HttpClient) { }

  getAllPoints(): Observable<PointCollecte[]> {
    return this.http.get<PointCollecte[]>(`${this.baseUrl}/all`);
}

  getPointById(id: number): Observable<PointCollecte> {
    return this.http.get<PointCollecte>(`${this.baseUrl}/${id}`);
  }

  createPoint(point: PointCollecte): Observable<PointCollecte> {
    console.log('Saving point with data:', point);
    return this.http.post<PointCollecte>(`${this.baseUrl}/savePointCollect`, point);
  }

  updatePoint(id:number, point: PointCollecte): Observable<PointCollecte> {
    console.log('Updating point with data:', point);
    return this.http.put<PointCollecte>(`${this.baseUrl}/updatePointCollect`, point);
  }

  deletePoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePointCollect/${id}`);
  }

  getPointsForMap(): Observable<{points: MapPoint[], timestamp: number}> {
    return this.http.get<{points: MapPoint[], timestamp: number}>(`${this.baseUrl}/map`);
  }

  findNearestPointByCoords(lat: number, lng: number): Observable<PointCollecte> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString());
    return this.http.get<PointCollecte>(`${this.baseUrl}/nearest`, { params });
  }
  findNearestPoint(address: string): Observable<PointCollecte> {
    return this.http.get<PointCollecte>(`${this.baseUrl}/nearest`, {
        params: { address }
    });
}

  getDirections(userLat: number, userLon: number, pointId: number): Observable<DirectionsResponse> {
    const params = new HttpParams()
      .set('userLat', userLat.toString())
      .set('userLon', userLon.toString())
      .set('pointId', pointId.toString());
    return this.http.get<DirectionsResponse>(`${this.baseUrl}/directions`, { params });
  }

  schedulePickup(pointId: number, pickupTime: string): Observable<SchedulePickupResponse> {
    return this.http.post<SchedulePickupResponse>(`${this.baseUrl}/schedule-pickup`, { pointId, pickupTime });
  }
}