import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/admin/models/reclamation.model';
import { Chart, registerables } from 'chart.js';
import { SupportReclamationService } from 'src/app/services/support-reclamation.service'; // Remarquez le service modifié pour SupportReclamation
import { SupportReclamation } from 'src/app/admin/models/support-reclamation.model';

@Component({
  selector: 'app-reclamation-chart',
  templateUrl: './reclamation-chart.component.html',
  styleUrls: ['./reclamation-chart.component.css']
})
export class ReclamationChartComponent implements OnInit {
  @ViewChild('reclamationChart') chartElement: ElementRef | undefined;
  @ViewChild('dateChart') dateChartElement: ElementRef | undefined;
  @ViewChild('statusChart') statusChartElement: ElementRef | undefined;

  supportReclamations: SupportReclamation[] = [];  
  statusChart: any;  

  reclamations: Reclamation[] = [];
  chart: any;
  dateChart: any;

  constructor(
    private reclamationService: ReclamationService,
    private supportReclamationService: SupportReclamationService 
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchReclamations();
    this.loadReclamations();
  }

  fetchReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.createChart();
       
      },
      error: (error) => {
        console.error('Erreur de chargement des réclamations:', error);
      }
    });
  }

  loadReclamations(): void {
    this.supportReclamationService.getAll().subscribe({
      next: (data) => {
        this.supportReclamations = data;
        this.createStatusChart();
      },
      error: (err) => console.error('Erreur de chargement des support réclamations:', err)
    });
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  
    const colorMap: { [key: string]: string } = {
      EN_ATTENTE: '#FFA726',   // Orange
      TRAITEE: '#66BB6A',      // Vert
      REJETEE: '#EF5350',      // Rouge
      NONAFFECTEE: '#AB47BC',  // Violet
      URGENT: '#D32F2F'        // Rouge foncé
    };
  
    const reclamationCounts = this.reclamations.reduce((acc: any, reclamation) => {
      const state = reclamation.etatReclamation;
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(reclamationCounts);
    const data = Object.values(reclamationCounts);
    const backgroundColors = labels.map(label => colorMap[label] || '#90A4AE'); // gris par défaut si pas mappé
  
    const ctx = this.chartElement?.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nombre de réclamations',
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Réclamations par État'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const rawValue = context.raw as number;
                  return `${context.label}: ${rawValue} réclamation${rawValue > 1 ? 's' : ''}`;
                }
              }
            },
            legend: {
              display: false // Pas de légende nécessaire, les couleurs suffisent
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  createStatusChart(): void {
    if (this.statusChart) {
      this.statusChart.destroy();
    }

    // Comptage des réclamations ouvertes et clôturées
    const statusCounts = this.supportReclamations.reduce((acc: any, supportReclamation) => {
      const status = supportReclamation.dateClotureSupport ? 'Clôturé' : 'Ouvert';  // Utilisation de dateClotureSupport pour déterminer l'état
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    const ctx = this.statusChartElement?.nativeElement.getContext('2d');
    if (ctx) {
      this.statusChart = new Chart(ctx, {
        type: 'pie',  // Pie chart type
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#66BB6A', '#EF5350'], // Vert pour ouvert, rouge pour clôturé
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Réclamations : Ouvert / Clôturé'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const rawValue = context.raw as number;
                  return `${context.label}: ${rawValue} réclamation${rawValue > 1 ? 's' : ''}`;
                }
              }
            },
            legend: {
              position: 'top'
            }
          }
        }
      });
    }
  }
}
