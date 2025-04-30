import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent {

// modified
constructor(private router : Router){};

  goBackHome() {
    const userRole = this.getUserRole(); // You must implement how you get it

    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (userRole === 'USER') {
      this.router.navigate(['/user/home']);
    } else {
      this.router.navigate(['/']); // Default fallback
    }
  }

  getUserRole(): string {
    // Example: get role from localStorage, token, service...
    return localStorage.getItem('userRole') || 'USER';
  }
}
