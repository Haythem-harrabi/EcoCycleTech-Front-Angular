import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationKey = 'EMAIL_NOT_VERIFIED';

export interface AppNotification {
  key : NotificationKey;
  label: string;          // phrase courte
  body?: string;          // détail optionnel (HTML permis)
  date: string;           // ISO – pour trier/afficher « il y a 3 min »
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _changes = new BehaviorSubject<AppNotification[]>([]);
  readonly changes$ = this._changes.asObservable();

  private store  = new Set<NotificationKey>();
  private dates: Partial<Record<NotificationKey, string>> = {};


  private readonly labels: Record<NotificationKey,
                                  Omit<AppNotification, 'date'>> = {
    EMAIL_NOT_VERIFIED: {
      key  : 'EMAIL_NOT_VERIFIED',
      label: 'Votre adresse mail n est pas vérifiée',
      body : 'Cliquez sur le lien reçu par e-mail pour activer votre compte.'
    }
  };

  constructor() {
    const saved = localStorage.getItem('notifications');
    if (saved) this.store = new Set(JSON.parse(saved));
    this.emit();
  }


  
  private list(): AppNotification[] {
    return [...this.store]
      .map(k => ({
        ...this.labels[k],
        date: this.dates[k] ?? new Date().toISOString()   // fallback
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  add(key: NotificationKey) {
    this.store.add(key);
    this.dates[key] = new Date().toISOString();   // MAJ date systématique
    this.persist();
  }

  remove(key: NotificationKey) {
    if (this.store.delete(key)) {
      delete this.dates[key];
      this.persist();
    }
  }

  has(key: NotificationKey) { return this.store.has(key); }
  count() { return this.store.size; }


  private persist() {
    localStorage.setItem('notifications', JSON.stringify([...this.store]));
    this.emit();
  }
  private emit() { this._changes.next(this.list()); }

}