import { TestBed } from '@angular/core/testing';

import { RendzeVousReparationService } from './rendze-vous-reparation.service';

describe('RendzeVousReparationService', () => {
  let service: RendzeVousReparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendzeVousReparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
