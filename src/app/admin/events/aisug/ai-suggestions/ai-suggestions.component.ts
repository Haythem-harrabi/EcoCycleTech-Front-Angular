import { Component } from '@angular/core';
import { AISuggestionService } from '../../service/ai-suggestion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-suggestions',
  templateUrl: './ai-suggestions.component.html',
  styleUrls: ['./ai-suggestions.component.css']
})
export class AISuggestionsComponent {
  suggestionText: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  cooldown: number = 0;
  private cooldownInterval: any;

  constructor(
    private aiService: AISuggestionService,
    private router: Router
  ) {}

  getSuggestions(): void {
    if (this.cooldown > 0) return;

    this.isLoading = true;
    this.error = null;
    this.suggestionText = '';

    this.aiService.getEventSuggestions().subscribe({
      next: (response) => {
        this.suggestionText = response;
        this.isLoading = false;
        this.startCooldown(15); // 15 second cooldown
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        if (err.message.includes('wait')) {
          this.startCooldown(30);
        }
      }
    });
  }

  private startCooldown(seconds: number): void {
    this.cooldown = seconds;
    clearInterval(this.cooldownInterval);
    this.cooldownInterval = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }

  useSuggestion(): void {
    if (!this.suggestionText) return;
    
    try {
      const eventData = this.parseSuggestion(this.suggestionText);
      this.router.navigate(['/admin/events'], { 
        state: { prefill: eventData } 
      });
    } catch (e) {
      this.error = 'Could not parse this suggestion. Please try another.';
    }
  }

  private parseSuggestion(text: string): any {
    const result: any = {};
    text.split('\n').forEach(line => {
      if (line.startsWith('Event Name:')) result.nomEvenement = line.substring(11).trim();
      else if (line.startsWith('Date:')) result.dateEvenement = new Date(line.substring(5).trim());
      else if (line.startsWith('Location:')) result.localisationEvenement = line.substring(9).trim();
      else if (line.startsWith('Capacity:')) result.nbrPlacesEvenement = parseInt(line.substring(9).trim());
      else if (line.startsWith('Price:')) result.prixEvenement = parseFloat(line.substring(6).replace('TND', '').trim());
      else if (line.startsWith('Venue:')) result.lieuEvenement = line.substring(6).trim();
      else if (line.startsWith('Description:')) result.description = line.substring(12).trim();
    });
    
    if (!result.nomEvenement) throw new Error('Invalid format');
    return result;
  }

  ngOnDestroy() {
    clearInterval(this.cooldownInterval);
  }
}