import { TestBed } from '@angular/core/testing';

import { PointCollecteService } from './point-de-collect.service';

describe('PointDeCollectService', () => {
  let service: PointCollecteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointCollecteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
