import { TestBed } from '@angular/core/testing';

import { D17PaymentService } from './d17-payment.service';

describe('D17PaymentService', () => {
  let service: D17PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D17PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
