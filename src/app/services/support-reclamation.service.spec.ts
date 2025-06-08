import { TestBed } from '@angular/core/testing';

import { SupportReclamationService } from './support-reclamation.service';

describe('SupportReclamationService', () => {
  let service: SupportReclamationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportReclamationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
