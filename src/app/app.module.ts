import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './client/layout/layout.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AddPlanStockageComponent } from './admin/GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { PlanStockageListComponent } from './admin/GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { AdminLayoutModule } from './admin/admin-layout/admin-layout.module';
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
@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    LoginComponent,
    VerifyEmailComponent,
    OAuth2RedirectComponent,
    UserProfileComponent
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
    MenuModule,
    BadgeModule
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
