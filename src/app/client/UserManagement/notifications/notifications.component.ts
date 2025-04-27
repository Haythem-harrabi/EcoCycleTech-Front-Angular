import { Component } from '@angular/core';
import { NotificationService, AppNotification } from '../services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class NotificationsComponent {
  notifs: AppNotification[] = [];

  constructor(private notif: NotificationService) {
    this.notif.changes$.subscribe(list => this.notifs = list);
  }

  markAsRead(n: AppNotification) {
    this.notif.remove(n.key);
  }
}