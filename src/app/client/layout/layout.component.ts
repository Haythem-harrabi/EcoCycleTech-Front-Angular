import { Component } from '@angular/core';
import { AuthService } from '../UserManagement/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  authService!:AuthService;

  // In your navbar or header component
logout(): void {
  this.authService.logout();
}
}
