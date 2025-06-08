import { TestBed } from '@angular/core/testing';

import { CommentaireDemandeService } from './commentaire-demande.service';

describe('CommentaireDemandeService', () => {
  let service: CommentaireDemandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentaireDemandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
