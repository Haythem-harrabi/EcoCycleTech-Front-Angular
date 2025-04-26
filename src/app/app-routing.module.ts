import { PaymentSuccessComponent } from './admin/GestionAppareils/paymentsuccess/paymentsuccess.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ReservationComponent } from './admin/GestionAppareils/reservation/reservation.component';
import { AppareilComponent } from './admin/GestionAppareils/appareil/appareil.component';
import { AddAppareilComponent } from './admin/GestionAppareils/add-appareil/add-appareil.component';
import { AddReservationComponent } from './admin/GestionAppareils/add-reservation/add-reservation.component';
import { AvisComponent } from './admin/GestionAppareils/avis/avis.component';
import { AddAvisComponent } from './admin/GestionAppareils/add-avis/add-avis.component';
import { RecommendationsComponent } from './admin/GestionAppareils/recommendations/recommendations.component';
import { PanierComponent } from './admin/GestionAppareils/panier/panier.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'Appareils', component: AppareilComponent },
      { path: 'Reservations', component: ReservationComponent },
      { path: 'AddReservation', component: AddReservationComponent },
      { path: 'Avis', component: AvisComponent },
      { path: 'AddAvis', component: AddAvisComponent },
      { path: 'AddAvis/:id', component: AddAvisComponent },
      { path: 'recommendations', component: RecommendationsComponent },
      { 
        path: 'payment/success/:id', 
        component: PaymentSuccessComponent 
      },
      { path: 'panier', component: PanierComponent },
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent,
    children: [
      { path: 'Reservations', component: ReservationComponent },
      { path: 'Appareils', component: AppareilComponent },
      { path: 'AddAppareil', component: AddAppareilComponent },
      { path: 'AddAppareil/:id', component: AddAppareilComponent },
      { path: 'AddReservation', component: AddReservationComponent },
      { path: 'AddReservation/:id', component: AddReservationComponent },
      { path: 'Avis', component: AvisComponent },
      { path: 'AddAvis/:id', component: AddAvisComponent },
      { 
        path: 'payment/success/:id', 
        component: PaymentSuccessComponent 
      },    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
