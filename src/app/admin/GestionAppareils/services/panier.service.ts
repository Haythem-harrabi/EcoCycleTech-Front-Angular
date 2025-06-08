// src/app/services/panier.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appareil } from '../model/appareil';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private cartItemsSubject = new BehaviorSubject<Appareil[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  ajouterAppareil(appareil: Appareil): void {
    const currentCart = this.cartItemsSubject.value;
    if (!currentCart.some(item => item.idAppareil === appareil.idAppareil)) {
      const updatedCart = [...currentCart, appareil];
      this.cartItemsSubject.next(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  }

  getAppareilsInCart(): Appareil[] {
    return this.cartItemsSubject.value;
  }

  removeAppareil(id: number): void {
    const updatedCart = this.cartItemsSubject.value.filter(
      item => item.idAppareil !== id
    );
    this.cartItemsSubject.next(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  clearPanier(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.length;
  }
}