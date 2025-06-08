import { TestBed } from '@angular/core/testing';

import { PlanStockageService } from './plan-stockage.service';

describe('PlanStockageService', () => {
  let service: PlanStockageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanStockageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
