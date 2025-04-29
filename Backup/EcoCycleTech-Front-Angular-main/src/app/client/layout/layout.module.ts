import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { AccueilComponent } from '../accueil/accueil.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    DividerModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    StyleClassModule,
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
