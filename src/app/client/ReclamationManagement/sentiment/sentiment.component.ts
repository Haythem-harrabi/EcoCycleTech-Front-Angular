import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.css']
})
export class SentimentComponent {
  textInput: string = '';
  result: any = null;
  error: string | null = null;
  averageRating: number = 0;
  totalRatings: number = 0;
  comments: any[] = [];
  form: FormGroup;




  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      rating: [null]
    });
  }
  stars: { filled: boolean, half: boolean }[] = Array(5).fill({}).map(() => ({
    filled: false,
    half: false
  }));

analyser() {
  const headers = new HttpHeaders().set('Content-Type', 'text/plain');
  
  this.http.post<any>('http://localhost:8082/ecoCycleTech/api/sentiment', this.textInput, { headers })
    .subscribe({
      next: (data) => {
        this.result = {
          ...data,
          text: this.textInput // <= ajoute le texte saisi à l'objet résultat
        };
        this.error = null;
        this.form.get('rating')?.setValue(data.note);
        this.getAverageRating();
        this.getComments();
        console.log(typeof this.result.note);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = err.error?.error || "Erreur de communication avec le serveur";
        this.result = null;
      }
    });
}

getAverageRating() {
  this.http.get<any>('http://localhost:8082/ecoCycleTech/api/sentiment/average')
    .subscribe({
      next: (data) => {
        // Conversion explicite en nombre
        this.averageRating = Number(data.average) || 0;
        this.totalRatings = Number(data.count) || 0;
        
        // Mettre à jour notre tableau d'étoiles personnalisé
        this.updateStarsArray(this.averageRating);
        
        console.log('Moyenne récupérée:', this.averageRating, 'sur', this.totalRatings, 'évaluations');
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la moyenne:', err);
      }
    });
}

  getComments() {
    this.http.get<any>('http://localhost:8082/ecoCycleTech/api/sentiment/comments')
      .subscribe({
        next: (data) => {
          this.comments = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des commentaires:', err);
        }
      });
  }

  getSentimentClass(sentiment: string): string {
    switch(sentiment?.toLowerCase()) {
      case 'very positive': return 'bg-success text-white';
      case 'positive': return 'bg-success bg-opacity-75 text-white';
      case 'neutral': return 'bg-warning text-dark';
      case 'negative': return 'bg-danger bg-opacity-75 text-white';
      case 'very negative': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getSentimentIcon(sentiment: string): string {
    switch(sentiment?.toLowerCase()) {
      case 'very positive': return 'fas fa-grin-stars';
      case 'positive': return 'fas fa-smile';
      case 'neutral': return 'fas fa-meh';
      case 'negative': return 'fas fa-frown';
      case 'very negative': return 'fas fa-angry';
      default: return 'fas fa-question-circle';
    }
  }
  getProgressBarClass(sentiment: string): string {
    // Your logic to return the appropriate class based on sentiment
    return sentiment === 'positive' ? 'progress-positive' : 'progress-negative';
  }

  isHighRating(rating: number): boolean {
    return rating >= 3;  // Vous pouvez ajuster la condition selon votre logique
  }

  updateStarsArray(rating: number) {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Étoile complètement remplie
        this.stars.push({ filled: true, half: false });
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Demi-étoile
        this.stars.push({ filled: false, half: true });
      } else {
        // Étoile vide
        this.stars.push({ filled: false, half: false });
      }
    }
  }
}