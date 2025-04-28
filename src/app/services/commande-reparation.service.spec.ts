import { TestBed } from '@angular/core/testing';

import { CommandeReparationService } from './commande-reparation.service';

describe('CommandeReparationService', () => {
  let service: CommandeReparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandeReparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
