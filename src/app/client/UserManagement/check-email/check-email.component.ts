import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-check-email',
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.css']
})
export class CheckEmailComponent implements OnInit {

  email = '';
  wait = 15;                  // secondes d’attente
  private timerId!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // e.g.  /check-email?email=user@example.com
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  openMailClient(): void {
    window.open('mailto:' + this.email);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
