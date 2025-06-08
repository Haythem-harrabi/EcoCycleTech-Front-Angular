import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly API_KEY = '9d53f57e2eae380cf08e37500c99d1f2';
  private readonly API_PATH = '/weather-api/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(location: string): Observable<{temp: number; icon: string}|null> {
    if (!location?.trim()) return of(null);
    
    return this.http.get(this.API_PATH, {
      params: new HttpParams()
        .set('q', location.trim())
        .set('units', 'metric')
        .set('appid', this.API_KEY),
      headers: {
        'Skip-Interceptor': 'true'
      }
    }).pipe(
      map((res: any) => ({
        temp: Math.round(res.main.temp),
        icon: this.getWeatherIcon(res.weather[0].id)
      })),
      catchError(error => {
        console.error('Weather API Error:', error);
        return of(null);
      })
    );
  }
  private getWeatherIcon(code: number): string {
    if (code >= 200 && code < 300) return '';
    if (code >= 300 && code < 600) return '';
    if (code >= 600 && code < 700) return '';
    if (code === 800) return '';
    if (code > 800) return '';
    return '🌈';
  }
}