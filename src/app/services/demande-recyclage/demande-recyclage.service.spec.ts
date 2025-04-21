import { TestBed } from '@angular/core/testing';

import { DemandeRecyclageService } from './demande-recyclage.service';

describe('DemandeRecyclageService', () => {
  let service: DemandeRecyclageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeRecyclageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
