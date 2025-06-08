import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PanierService } from '../services/panier.service';
import { Appareil } from '../model/appareil';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  cartItems: Appareil[] = [];
  total = 0;

  constructor(
    private panierService: PanierService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.panierService.getAppareilsInCart();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.prix, 0);
  }

  removeItem(id: number): void {
    this.panierService.removeAppareil(id);
    this.loadCartItems();
    this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
  }

  clearCart(): void {
    this.panierService.clearPanier();
    this.loadCartItems();
    this.snackBar.open('Cart cleared', 'Close', { duration: 2000 });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/AddReservation']);
    } else {
      this.snackBar.open('Your cart is empty', 'Close', { duration: 2000 });
    }
  }
}