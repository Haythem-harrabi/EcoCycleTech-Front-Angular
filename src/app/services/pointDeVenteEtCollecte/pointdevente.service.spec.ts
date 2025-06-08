import { TestBed } from '@angular/core/testing';

import { PointdeventeService } from './pointdevente.service';

describe('PointdeventeService', () => {
  let service: PointdeventeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointdeventeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
