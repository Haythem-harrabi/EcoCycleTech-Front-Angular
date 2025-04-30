import { TestBed } from '@angular/core/testing';

import { EspaceStockageService } from './espace-stockage.service';

describe('EspaceStockageService', () => {
  let service: EspaceStockageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaceStockageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
