import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/client/UserManagement/services/auth.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent {



  constructor(private authService : AuthService, private router: Router){

  }

   goBackHome() {
    const userRole = this.getUserRole(); // You must implement how you get it

    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (userRole === 'USER') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']); // Default fallback
    }
  }

  getUserRole(): string {
   return this.authService.getCurrentUser().role;
  }
}
