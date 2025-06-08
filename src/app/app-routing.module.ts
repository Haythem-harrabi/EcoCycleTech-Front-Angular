import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { LoginComponent } from './client/UserManagement/login/login.component';
import { AdminGuard } from './client/UserManagement/guards/admin.guard';
import { Role } from './client/UserManagement/enum/role';
import { VerifyEmailComponent } from './client/UserManagement/verify-email/verify-email.component';
import { OAuth2RedirectComponent } from './client/UserManagement/oauth2-redirect/oauth2-redirect.component';
import { UserProfileComponent } from './client/UserManagement/user-profile/user-profile.component';
import { AuthGuard } from './client/UserManagement/guards/auth.guard';
import { UserManagementComponent } from './admin/UserManagement/user-management/user-management.component';
import { CheckEmailComponent } from './client/UserManagement/check-email/check-email.component';
import { NotificationsComponent } from './client/UserManagement/notifications/notifications.component';
import { ChatComponent } from './client/UserManagement/chat/chat.component';
import { UserStatisticsComponent } from './admin/UserManagement/user-statistics/user-statistics.component';
import { AppareilComponent } from './admin/GestionAppareils/appareil/appareil.component';
import { ReservationComponent } from './admin/GestionAppareils/reservation/reservation.component';
import { AddReservationComponent } from './admin/GestionAppareils/add-reservation/add-reservation.component';
import { AvisComponent } from './admin/GestionAppareils/avis/avis.component';
import { AddAppareilComponent } from './admin/GestionAppareils/add-appareil/add-appareil.component';
import { AddAvisComponent } from './admin/GestionAppareils/add-avis/add-avis.component';
import { RecommendationsComponent } from './admin/GestionAppareils/recommendations/recommendations.component';
import { PaymentSuccessComponent } from './admin/GestionAppareils/paymentsuccess/paymentsuccess.component';
import { PanierComponent } from './admin/GestionAppareils/panier/panier.component';
import { EventListComponent } from './admin/events/eventcomponents/event-list/event-list.component';
import { CalendarComponent } from './admin/events/eventcomponents/calendar/calendar/calendar.component';
import { TicketListComponent } from './admin/events/ticketcomponent/ticket-list/ticket-list/ticket-list.component';
import { EventFormComponent } from './admin/events/eventcomponents/event-form/event-form.component';
import { TicketFormComponent } from './admin/events/ticketcomponent/ticket-form/ticket-form/ticket-form.component';
import { AISuggestionsComponent } from './admin/events/aisug/ai-suggestions/ai-suggestions.component';
import { AddPlanStockageComponent } from './admin/GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { EcodriveChartsComponent } from './admin/GestionPlansStockage/ecodrive-charts/ecodrive-charts.component';
import { PlanStockageListComponent } from './admin/GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { PaypalComponent } from './client/GestionStockage/paypal/paypal.component';
import { EcoDriveAccueilComponent } from './client/GestionStockage/eco-drive-accueil/eco-drive-accueil.component';
import { EspaceStockageComponent } from './client/GestionStockage/espace-stockage/espace-stockage.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { AddSupportReclamationComponent } from './admin/SupportReclamationManagement/add-support-reclamation/add-support-reclamation.component';
import { UpdateReclamationComponent } from './client/ReclamationManagement/reclamation/update-reclamation/update-reclamation.component';
import { ListReclamationAdminComponent } from './admin/ReclamationManagement/list-reclamation-admin/list-reclamation-admin.component';
import { UpdateReclamationAdminComponent } from './admin/ReclamationManagement/update-reclamation-admin/update-reclamation-admin.component';
import { ListsupportReclamationComponent } from './admin/SupportReclamationManagement/listsupport-reclamation/listsupport-reclamation.component';
import { ReclamationChartComponent } from './admin/ReclamationManagement/reclamation-chart/reclamation-chart.component';
import { SentimentComponent } from './client/ReclamationManagement/sentiment/sentiment.component';
import { ChatbotComponent } from './client/ReclamationManagement/chatbot/chatbot.component';
import { Reclamation } from './admin/models/reclamation.model';
import { AddReclamationComponent } from './client/ReclamationManagement/reclamation/add-reclamation/add-reclamation.component';
import { ReclamationComponent } from './client/ReclamationManagement/reclamation/reclamation.component';
import { DemandeRecycleComponent } from './client/demande-recycle/demande-recycle.component';
import { ListdemanderecycleComponent } from './admin/demande-recycle/listdemanderecycle/listdemanderecycle.component';
import { PointDeCollectComponent } from './admin/point-de-collect/point-de-collect.component';
import { VehiculeListComponent } from './admin/point-de-collect/vehicule-list/vehicule-list.component';
import { CollecteListComponent } from './admin/point-de-collect/collecte-list/collecte-list.component';
import { PointdeventefComponent } from './client/pointdeventef/pointdeventef.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'add/reclamation', component: AddReclamationComponent },
      { path: 'sentiment', component: SentimentComponent },
      { path: '', component: AccueilComponent },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard] // Protect the profile route
     },
     { path: 'pointdevente',component: PointdeventefComponent},
     { path: 'notifications',component: NotificationsComponent},
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
      { path: 'demanderecycle', component: DemandeRecycleComponent },
      { path: 'panier', component: PanierComponent },
      { path: 'events', component: EventListComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'EcoDrive', component: EcoDriveAccueilComponent }     ,
      {path:'Checkout', component: PaypalComponent} ,
      {path:'space', component: EspaceStockageComponent},
      { path: 'add/reclamation', component: AddReclamationComponent },
      { path: 'reclamation/update/:id',  component:UpdateReclamationComponent  },
      { path: 'claim', component: ReclamationComponent},

      {path: 'assistant',
        component: ChatbotComponent,
        data: { title: 'Assistant Virtuel' }},
      { path: '', redirectTo: 'sentiment', pathMatch: 'full' }

    ]
  },
  {path:'chat',component:ChatComponent},


  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard], // Protection de la route admin
    data: { roles: [Role.ADMIN] },// Rôle requis (remplacez par votre logique)
    children: [
      { path: 'users', component: UserManagementComponent },  // Make sure this component exists
      { path: 'user-statistics', component: UserStatisticsComponent }, // Same for this
      { path: 'Reservations', component: ReservationComponent },
      { path: 'Appareils', component: AppareilComponent },
      { path: 'AddAppareil', component: AddAppareilComponent },
      { path: 'AddAppareil/:id', component: AddAppareilComponent },
      { path: 'AddReservation', component: AddReservationComponent },
      { path: 'AddReservation/:id', component: AddReservationComponent },
      { path: 'Avis', component: AvisComponent },
      { path: 'AddAvis/:id', component: AddAvisComponent },
      {
        path: 'listdemanderecycle', component: ListdemanderecycleComponent
      },
      { path: 'pointsdecollecte', component: PointDeCollectComponent },
      { path: 'VehiculeList', component: VehiculeListComponent },
      { path: 'CollectionList', component: CollecteListComponent },
      { path: 'supportreclamtion/create', component: AddSupportReclamationComponent },//eva
      { path: 'list/reclamation', component: ListReclamationAdminComponent },
      { path: 'update/reclamation/:id', component: UpdateReclamationAdminComponent },
      { path: 'listSupportReclamation', component: ListsupportReclamationComponent },
      { path: 'supportreclamtion/create', component: AddSupportReclamationComponent },
      { path: 'chart', component: ReclamationChartComponent },
      {
        path: 'payment/success/:id',
        component: PaymentSuccessComponent
      },
      { path: 'events', component: EventListComponent },
      { path: 'newevent', component: EventFormComponent },
      { path: 'edit-event/:id', component: EventFormComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'newticket', component: TicketFormComponent },
      { path: 'ai-suggestions', component: AISuggestionsComponent },
      { path: 'addPlan', component: AddPlanStockageComponent },
      { path: 'Plans', component: PlanStockageListComponent },
      { path: 'addPlan/:id', component: AddPlanStockageComponent },
      { path: 'charts', component: EcodriveChartsComponent }
    ]
  },
  { path: 'notifications',component: NotificationsComponent},
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'oauth2/redirect', component: OAuth2RedirectComponent },
  { path: 'oauth2/callback', component: OAuth2RedirectComponent },



  // Redirection pour les routes non trouvées
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
