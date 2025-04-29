import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './client/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AddPlanStockageComponent } from './admin/GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { PlanStockageListComponent } from './admin/GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { AdminLayoutModule } from './admin/admin-layout/admin-layout.module';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { ReclamationDetailsComponent } from './client/reclamation-details/reclamation-details.component';



@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    ReclamationComponent,
    ReclamationListComponent,
    ReclamationDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
