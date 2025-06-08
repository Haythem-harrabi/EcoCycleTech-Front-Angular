import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AdminFooterComponent } from './admin-layout/admin-footer/admin-footer.component';
import { AdminMenuComponent } from './admin-layout/admin-menu/admin-menu.component';
import { AdminSidebarComponent } from './admin-layout/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './admin-layout/admin-topbar/admin-topbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppMenuitemComponent } from './admin-layout/admin-menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { Table } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { UserManagementComponent } from './UserManagement/user-management/user-management.component';
import { AddPlanStockageComponent } from './GestionPlansStockage/add-plan-stockage/add-plan-stockage.component';
import { EcodriveChartsComponent } from './GestionPlansStockage/ecodrive-charts/ecodrive-charts.component';
import { PlanStockageListComponent } from './GestionPlansStockage/plan-stockage-list/plan-stockage-list.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AdminFooterComponent,
    AdminMenuComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AppMenuitemComponent,
    AdminLayoutComponent,
    UserManagementComponent,
    AddPlanStockageComponent,
    PlanStockageListComponent,
    EcodriveChartsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
    //ajoutés par user
    ConfirmDialogModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    TooltipModule,
    //Haythem
    InputNumberModule,
    CardModule,
    ProgressBarModule,
    ReactiveFormsModule,
    DropdownModule,
    NgChartsModule
  ]
})
export class AdminLayoutModule { }
