import { Component } from '@angular/core';
import { RecommendationService } from '../services/recommendation.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent {
  query = '';
  recommendations: any[] = [];
  error = '';

  constructor(private recommendationService: RecommendationService) {}

  fetchRecommendations() {
    this.error = '';
    this.recommendationService.getRecommendations(this.query).subscribe(
      (data) => {
        this.recommendations = data;
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
        this.error = 'Failed to fetch recommendations. Please try again.';
      }
    );
  }
}
