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
import { LoginComponent } from './client/UserManagement/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './client/UserManagement/verify-email/verify-email.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { OAuth2RedirectComponent } from './client/UserManagement/oauth2-redirect/oauth2-redirect.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    LoginComponent,
    VerifyEmailComponent,
    OAuth2RedirectComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SocialLoginModule
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
