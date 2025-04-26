import { Component } from '@angular/core';
import { NotificationService, AppNotification } from '../services/notification.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
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
