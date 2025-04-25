import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './admin-topbar/admin-topbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppMenuitemComponent } from './admin-menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout.component";
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
import { UserManagementComponent } from '../UserManagement/user-management/user-management.component';


@NgModule({
  declarations: [
    AdminFooterComponent,
    AdminMenuComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AppMenuitemComponent,
    AdminLayoutComponent,
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
    TooltipModule


  ]
})
export class AdminLayoutModule { }
