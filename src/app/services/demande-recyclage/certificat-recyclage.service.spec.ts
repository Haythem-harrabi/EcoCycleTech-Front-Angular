import { TestBed } from '@angular/core/testing';

import { CertificatRecyclageService } from './certificat-recyclage.service';

describe('CertificatRecyclageService', () => {
  let service: CertificatRecyclageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificatRecyclageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
