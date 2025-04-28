import { TestBed } from '@angular/core/testing';

import { PointDeCollectService } from './point-de-collect.service';

describe('PointDeCollectService', () => {
  let service: PointDeCollectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointDeCollectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
