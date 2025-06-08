import { FactureService } from './facture.service';
import { TestBed } from '@angular/core/testing';

describe('FactureService', () => {
  let service: FactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
