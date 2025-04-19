import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFooterComponent } from './admin-layout/admin-footer/admin-footer.component';
import { AdminMenuComponent } from './admin-layout/admin-menu/admin-menu.component';
import { AdminSidebarComponent } from './admin-layout/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './admin-layout/admin-topbar/admin-topbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuitemComponent } from './admin-layout/admin-menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { AddPlanStockageComponent } from './GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { CardModule } from 'primeng/card';
import { PlanStockageListComponent } from './GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';




@NgModule({
  declarations: [
    AdminFooterComponent,
    AdminMenuComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AppMenuitemComponent,
    AdminLayoutComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    TagModule,
    ReactiveFormsModule,
    AdminLayoutRoutingModule
  ]
})
export class AdminLayoutModule { }
