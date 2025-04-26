// src/app/services/panier.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { PanierService } from '../services/panier.service';

describe('PanierService', () => {
  let service: PanierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanierService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(service.getAppareilsInCart().length).toBe(0);
  });

  it('should persist empty cart in localStorage', () => {
    service.clearPanier();
    expect(localStorage.getItem('cart')).toBeTruthy();
  });
});
