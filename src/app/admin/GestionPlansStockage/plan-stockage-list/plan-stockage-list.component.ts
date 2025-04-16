import { Component, OnInit } from '@angular/core';
import { PlanStockage } from 'src/app/entities/planStockage';
import { PlanStockageService } from 'src/app/services/plan-stockage.service';

@Component({
  selector: 'app-plan-stockage-list',
  templateUrl: './plan-stockage-list.component.html',
  styleUrls: ['./plan-stockage-list.component.css']
})
export class PlanStockageListComponent implements OnInit {
  plans: PlanStockage[] = [];

  constructor(private planService: PlanStockageService) {}

  ngOnInit(): void {
    this.planService.getPlans().subscribe(data => {
      this.plans = data;
    });
  }
}