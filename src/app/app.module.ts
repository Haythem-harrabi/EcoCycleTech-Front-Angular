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
import { HttpClientModule } from '@angular/common/http';
import { DemandeRecyclageService } from './services/demande-recyclage/demande-recyclage.service';
import { CertificatRecyclageService } from './services/demande-recyclage/certificat-recyclage.service';
import { FormsModule } from '@angular/forms';
import { CertificateRecyclageComponent } from './client/certificate-recyclage/certificate-recyclage.component';
import { DemandeRecycleComponent } from './client/demande-recycle/demande-recycle.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ListdemanderecycleComponent } from './admin/demande-recycle/listdemanderecycle/listdemanderecycle.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    DemandeRecycleComponent,
    CertificateRecyclageComponent,
    ListdemanderecycleComponent,
    
  ],
  imports: [
    BrowserModule,
    DialogModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    
  ],
  providers: [
    DemandeRecyclageService,
    CertificatRecyclageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
