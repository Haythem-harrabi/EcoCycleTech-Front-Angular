import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AccueilComponent } from './accueil/accueil.component';
import { EcoDriveAccueilComponent } from './GestionStockage/eco-drive-accueil/eco-drive-accueil.component';




const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'EcoDrive', component: EcoDriveAccueilComponent }      
    ]
  }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
