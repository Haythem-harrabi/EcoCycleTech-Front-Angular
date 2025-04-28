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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PointDeCollectComponent } from './admin/point-de-collect/point-de-collect.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PointdeventefComponent } from './client/pointdeventef/pointdeventef.component';
import { VehiculeListComponent } from './admin/point-de-collect/vehicule-list/vehicule-list.component';
import { CollecteListComponent } from './admin/point-de-collect/collecte-list/collecte-list.component';
import { CameraDetectionComponent } from './client/camera-detection/camera-detection.component';



@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    PointDeCollectComponent,
    PointdeventefComponent,
    VehiculeListComponent,
    CollecteListComponent,
    CameraDetectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
