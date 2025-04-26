import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './client/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutModule } from './admin/admin-layout/admin-layout.module';
import { AppareilComponent } from './admin/GestionAppareils/appareil/appareil.component';
import { AddAppareilComponent } from './admin/GestionAppareils/add-appareil/add-appareil.component';
import { ReservationComponent } from './admin/GestionAppareils/reservation/reservation.component';
import { AddReservationComponent } from './admin/GestionAppareils/add-reservation/add-reservation.component';
import { RecommendationsComponent } from './admin/GestionAppareils/recommendations/recommendations.component';
import { AvisComponent } from './admin/GestionAppareils/avis/avis.component';
import { AddAvisComponent } from './admin/GestionAppareils/add-avis/add-avis.component';
import { RouterModule } from '@angular/router';
import { ReservationConfirmationDialogComponent } from './admin/GestionAppareils/comfirmationdialog/comfirmationdialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';
import { PanierComponent } from './admin/GestionAppareils/panier/panier.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AppareilComponent,
    AddAppareilComponent,
    ReservationComponent,
    AddReservationComponent,
    RecommendationsComponent,
    AvisComponent,
    AddAvisComponent,
    ReservationConfirmationDialogComponent,
    PanierComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    QRCodeModule,
    MatSnackBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
