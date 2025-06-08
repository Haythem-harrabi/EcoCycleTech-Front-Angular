import { QRCodeModule } from 'angularx-qrcode';
import { Avis } from './admin/GestionAppareils/model/avis';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './client/layout.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AddPlanStockageComponent } from './admin/GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { PlanStockageListComponent } from './admin/GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { AdminLayoutModule } from './admin/admin-layout.module';
import { LoginComponent } from './client/UserManagement/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './client/UserManagement/verify-email/verify-email.component';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { OAuth2RedirectComponent } from './client/UserManagement/oauth2-redirect/oauth2-redirect.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './client/UserManagement/user-profile/user-profile.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { AuthService } from './client/UserManagement/services/auth.service';
import { AdminGuard } from './client/UserManagement/guards/admin.guard';
import { UserManagementComponent } from './admin/UserManagement/user-management/user-management.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckEmailComponent } from './client/UserManagement/check-email/check-email.component';
import { NotificationsComponent } from './client/UserManagement/notifications/notifications.component';
import { UserStatisticsComponent } from './admin/UserManagement/user-statistics/user-statistics.component';
import { AppareilComponent } from './admin/GestionAppareils/appareil/appareil.component';
import { AddAppareilComponent } from './admin/GestionAppareils/add-appareil/add-appareil.component';
import { ReservationComponent } from './admin/GestionAppareils/reservation/reservation.component';
import { AddReservationComponent } from './admin/GestionAppareils/add-reservation/add-reservation.component';
import { RecommendationsComponent } from './admin/GestionAppareils/recommendations/recommendations.component';
import { AvisComponent } from './admin/GestionAppareils/avis/avis.component';
import { AddAvisComponent } from './admin/GestionAppareils/add-avis/add-avis.component';
import { ReservationConfirmationDialogComponent } from './admin/GestionAppareils/comfirmationdialog/comfirmationdialog.component';
import { PanierComponent } from './admin/GestionAppareils/panier/panier.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarComponent } from './admin/events/eventcomponents/calendar/calendar/calendar.component';
import { EventListComponent } from './admin/events/eventcomponents/event-list/event-list.component';
import { TicketFormComponent } from './admin/events/ticketcomponent/ticket-form/ticket-form/ticket-form.component';
import { TicketListComponent } from './admin/events/ticketcomponent/ticket-list/ticket-list/ticket-list.component';
import { AISuggestionsComponent } from './admin/events/aisug/ai-suggestions/ai-suggestions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { StyleClassModule } from 'primeng/styleclass';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { EventFormComponent } from './admin/events/eventcomponents/event-form/event-form.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
//reclamation-yefa
import { SupportReclamation } from './admin/models/support-reclamation.model';//eva
import { Reclamation } from './admin/models/reclamation.model';//eva
import { AddSupportReclamationComponent } from './admin/SupportReclamationManagement/add-support-reclamation/add-support-reclamation.component';//eva
import { UpdateReclamationAdminComponent } from './admin/ReclamationManagement/update-reclamation-admin/update-reclamation-admin.component';//eva
import { ReclamationComponent } from './client/ReclamationManagement/reclamation/reclamation.component';//eva
import { ReclamationListComponent } from './client/ReclamationManagement/reclamation-list/reclamation-list.component';//eva
import { ReclamationDetailsComponent } from './client/ReclamationManagement/reclamation-details/reclamation-details.component';//eva
import { UpdateReclamationComponent } from './client/ReclamationManagement/reclamation/update-reclamation/update-reclamation.component';//eva
import { ListReclamationAdminComponent } from './admin/ReclamationManagement/list-reclamation-admin/list-reclamation-admin.component';//eva
import { ListsupportReclamationComponent } from './admin/SupportReclamationManagement/listsupport-reclamation/listsupport-reclamation.component';//eva
import { SentimentComponent } from './client/ReclamationManagement/sentiment/sentiment.component';//eva
import { ChatbotComponent } from './client/ReclamationManagement/chatbot/chatbot.component';//eva
import { ReclamationChartComponent } from './admin/ReclamationManagement/reclamation-chart/reclamation-chart.component';//eva
import { AddReclamationComponent } from './client/ReclamationManagement/reclamation/add-reclamation/add-reclamation.component';//eva
import { NgxCaptchaModule } from 'ngx-captcha';
import { StarRatingModule } from 'angular-star-rating';//YEFA
import { NgxStarRatingModule } from 'ngx-star-rating';
import { provideToastr } from 'ngx-toastr'; //YEFA
import { CertificateRecyclageComponent } from './client/certificate-recyclage/certificate-recyclage.component';
import { ListdemanderecycleComponent } from './admin/demande-recycle/listdemanderecycle/listdemanderecycle.component';
import { DemandeRecyclageService } from './services/demande-recyclage/demande-recyclage.service';
import { CertificatRecyclageService } from './services/demande-recyclage/certificat-recyclage.service';
import { DemandeRecycleComponent } from './client/demande-recycle/demande-recycle.component';
import { PointDeCollectComponent } from './admin/point-de-collect/point-de-collect.component';
import { PointdeventefComponent } from './client/pointdeventef/pointdeventef.component';
import { VehiculeListComponent } from './admin/point-de-collect/vehicule-list/vehicule-list.component';
import { CollecteListComponent } from './admin/point-de-collect/collecte-list/collecte-list.component';
import { PastDateValidatorDirective } from './admin/demande-recycle/listdemanderecycle/past-date.validator';
import { CarouselModule } from 'primeng/carousel';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyEmailComponent,
    OAuth2RedirectComponent,
    UserProfileComponent,
    CheckEmailComponent,
    NotificationsComponent,
    UserStatisticsComponent,
    AppareilComponent,
    AddAppareilComponent,
    ReservationComponent,
    AddReservationComponent,
    RecommendationsComponent,
    AvisComponent,
    AddAvisComponent,
    ReservationConfirmationDialogComponent,
    PanierComponent,
    CalendarComponent,
    EventFormComponent,
    EventListComponent,
    TicketFormComponent,
    TicketListComponent,
    AISuggestionsComponent,
    NotfoundComponent,
    AddSupportReclamationComponent,//eva
    ReclamationComponent,//eva
    ReclamationListComponent,//eva
    ReclamationDetailsComponent,//eva
    UpdateReclamationComponent,//eva
    ListReclamationAdminComponent,//eva
    UpdateReclamationAdminComponent,//eva
    ListsupportReclamationComponent,//eva
    AddSupportReclamationComponent,//eva
    SentimentComponent,//eva
    ChatbotComponent,//eva
    AddReclamationComponent,//eva
    ReclamationChartComponent,//eva
    DemandeRecycleComponent,
    CertificateRecyclageComponent,
    ListdemanderecycleComponent,PastDateValidatorDirective,
    PointDeCollectComponent,
    PointdeventefComponent,
    VehiculeListComponent,
    CollecteListComponent,


   // UserManagementComponent


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SocialLoginModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    ToastModule,
    RippleModule,
    MatDialogModule,
    RecaptchaV3Module,

    MenuModule,
    BadgeModule,
    MatSnackBarModule,
    QRCodeModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    ToastModule,
    RippleModule,
    MenuModule,
    CardModule,
    MessageModule,
    StyleClassModule,
    DropdownModule,
    CalendarModule,
    QRCodeModule,
    MatFormFieldModule,
    


  ],
  providers: [
    provideAnimations(),
    provideToastr(),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdsBx4rAAAAAOeT1gdoXy_XpUi0b2WiuzIvUnX0' },
    MessageService,
    AdminGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
         /* {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('278407912957-ja8f7vuh07kn8u9br218sds1p4fe10tb.apps.googleusercontent.com')
          },*/
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1097116375514611')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DemandeRecyclageService,
    CertificatRecyclageService
  ],

  exports: [StarRatingModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
