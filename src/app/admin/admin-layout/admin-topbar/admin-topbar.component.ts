import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.css']
})
export class AdminTopbarComponent {

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, public authService : AuthService) { }

  logout(event: Event): void {
    event.stopPropagation();
    this.authService.logout();
  }
  
}

