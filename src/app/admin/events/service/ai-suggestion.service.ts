import { Injectable } from '@angular/core';
import { CohereClient } from 'cohere-ai';
import { environment } from '../models/environment';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AISuggestionService {
  private cohere = new CohereClient({
    token: environment.cohereKey
  });

  private cachedSuggestions: string[] = [];
  private lastFetchTime: number = 0;

  constructor() { }

  getEventSuggestions(): Observable<string> {
    // Use cache if available (5 minute cache)
    if (this.cachedSuggestions.length > 0 && (Date.now() - this.lastFetchTime < 300000)) {
      return of(this.getRandomCachedSuggestion());
    }

    const prompt = `Generate 5 creative eco-tech event ideas for Tunisia with these exact specifications:
    
    Requirements:
    - Name: Catchy and creative (French/English)
    - Date: In 2025/2026 based on Tunisian holidays or islamic holidays or other special days related to the environment
    - Location: Tunis, Sousse, Sfax, or Djerba
    - Capacity: 50-500 attendees
    - Price: 20-100 TND
    - Venue: A hotel or a place based in the location 
    - Description: 1-2 sentences in English/French

    
    Format each exactly like this example:
    Event Name: EcoTech Tunis Forum
    Date: 22/04/2025 (Earth Day)
    Location: Tunis
    Capacity: 200
    Price: 50 TND
    Venue : Hotel africa
    Description: Annual gathering of eco-innovators showcasing sustainable tech solutions for North Africa.
    
    Now generate 5 new unique suggestions:`;

    return from(this.cohere.generate({
      prompt: prompt,
      maxTokens: 300,
      temperature: 0.8,
      k: 0,
      stopSequences: [],
      frequencyPenalty: 0,
      presencePenalty: 0
    })).pipe(
      timeout(10000), // 10 second timeout
      retry(2), // Retry twice on failure
      map(response => {
        if (!response.generations || response.generations.length === 0) {
          throw new Error('No generations returned');
        }
        
        // Extract and cache all suggestions
        const fullText = response.generations[0].text;
        this.cachedSuggestions = this.parseSuggestions(fullText);
        this.lastFetchTime = Date.now();
        
        return this.getRandomCachedSuggestion();
      }),
      catchError(error => {
        console.error('Cohere API Error:', error);
        return throwError(() => new Error(
          error.status === 429 ? 
          'Too many requests. Please wait...' : 
          'Failed to generate suggestions. Please try again.'
        ));
      })
    );
  }

  private parseSuggestions(text: string): string[] {
    return text.split('\n\n')
      .filter(suggestion => suggestion.includes('Event Name:'))
      .map(suggestion => suggestion.trim());
  }

  private getRandomCachedSuggestion(): string {
    return this.cachedSuggestions[
      Math.floor(Math.random() * this.cachedSuggestions.length)
    ];
  }
}