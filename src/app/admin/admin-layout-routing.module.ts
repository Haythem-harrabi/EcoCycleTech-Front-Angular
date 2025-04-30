import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AddPlanStockageComponent } from './GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { PlanStockageListComponent } from './GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { EcodriveChartsComponent } from './GestionPlansStockage/ecodrive-charts/ecodrive-charts.component';
 

const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    children: [
      { path: 'addPlan', component: AddPlanStockageComponent },
      { path: 'Plans', component: PlanStockageListComponent },
      { path: 'addPlan/:id', component: AddPlanStockageComponent },
      { path: 'charts', component: EcodriveChartsComponent }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {}
