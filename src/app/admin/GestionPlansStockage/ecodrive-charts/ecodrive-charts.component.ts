import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-ecodrive-charts',
  templateUrl: './ecodrive-charts.component.html',
  styleUrls: ['./ecodrive-charts.component.css']
})
export class EcodriveChartsComponent implements OnInit {

//Bar Chart
barChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {},
    y: {
      beginAtZero: true
    }
  }
};

barChartLabels: string[] = [];
barChartData: ChartDataset[] = [
  { data: [], 
    label: 'Subscriptions',
    maxBarThickness: 60,
  backgroundColor: "#a7c957" }
];

barChartType: ChartType = 'bar';



   // Line chart (Subscriptions last 7 days)
   lineChartLabels: string[] = [];
   lineChartData: any[] = [];
   
 
   // Pie chart (Plans)
   pieChartLabels: string[] = [];
   pieChartData: number[] = [];



   constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.loadSubscriptionsLast7Days();
    this.loadPlanSubscriptionCounts();
    this.loadBestPlansSubscriptions();
  }

  loadSubscriptionsLast7Days() {
    this.subscriptionService.getSubscriptionsLast7Days().subscribe(data => {
      this.lineChartLabels = data.map(item => item.date); // ex: ["2025-04-23", "2025-04-24", ...]
      this.lineChartData = [
        { data: data.map(item => item.count), label: 'Subscriptions',
          borderColor: '#4CAF50', // Green line
          backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light green fill
          pointBackgroundColor: '#4CAF50', // Green points
          pointBorderColor: '#4CAF50',
          pointHoverBackgroundColor: '#66BB6A', // Lighter green on hover
          pointHoverBorderColor: '#388E3C',
          fill:true,
    tension: 0.4 }
      ];
    });
  }

  loadPlanSubscriptionCounts() {
    this.subscriptionService.getPlanSubscriptionCounts().subscribe(data => {
      this.pieChartLabels = data.map(item => item.planName); // ex: ["Premium", "Basic"]
      this.pieChartData = data.map(item => item.subscriptionCount); // [20, 10]
      
    });
  }


  loadBestPlansSubscriptions(): void {
    this.subscriptionService.getBestPlansSubscriptions().subscribe(data => {
      this.barChartLabels = data.map(item => item.planName);
      this.barChartData[0].data = data.map(item => item.subscriptionCount);
    });
  }
}
