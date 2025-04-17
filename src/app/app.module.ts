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

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    LoginComponent,
    VerifyEmailComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    AdminLayoutModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
