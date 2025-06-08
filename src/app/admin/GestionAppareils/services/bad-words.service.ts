import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BadWordsService {

  private readonly badWords = ['shit', 'fuck', 'stupid']; // Liste des mots offensants à filtrer

  // Méthode de filtrage
  filter(content: string): string {
    let filteredContent = content;
    this.badWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Cas-insensitifs et toute la word boundary
      filteredContent = filteredContent.replace(regex, '**');
    });
    return filteredContent;
  }
}
