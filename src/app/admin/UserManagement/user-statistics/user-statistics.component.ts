import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; // adapte si besoin
declare var ApexCharts: any; // ✅ utilise ApexCharts du script externe

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {
  ageStats: any = {};
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchAgeStatistics();
  }

  fetchAgeStatistics(): void {
    this.userService.getUserAgeStatistics().subscribe({
      next: (stats) => {
        this.ageStats = stats;
        this.loading = false;
        this.renderChart();
      },
      error: (err) => {
        console.error('Failed to fetch age statistics', err);
        this.loading = false;
      }
    });
  }

  getAgeRanges(): string[] {
    return ['0-18', '19-25', '26-35', '36-50', '51+'];
  }

  renderChart(): void {
    setTimeout(() => {
      const chartDiv = document.querySelector("#ageChart");
      if (!chartDiv) {
        console.error('Chart container not found!');
        return;
      }
  
      const options = {
        chart: {
          type: 'bar',
          height: 350
        },
        title: {
          text: 'User Age Distribution',
          align: 'center'
        },
        series: [{
          name: 'Users',
          data: this.getAgeRanges().map(range => this.ageStats[range] || 0)
        }],
        xaxis: {
          categories: this.getAgeRanges()
        },
        colors: ['#0d6efd'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: true
        }
      };
  
      const chart = new ApexCharts(chartDiv, options);
      chart.render();
    }, 0); 
  }
}
