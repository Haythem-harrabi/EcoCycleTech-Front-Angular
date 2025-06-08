import { AvisService } from './avis.service';
import { TestBed } from '@angular/core/testing';
describe('AvisService', () => {
  let service: AvisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
