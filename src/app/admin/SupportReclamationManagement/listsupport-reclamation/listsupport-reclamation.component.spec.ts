import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsupportReclamationComponent } from './listsupport-reclamation.component';

describe('ListsupportReclamationComponent', () => {
  let component: ListsupportReclamationComponent;
  let fixture: ComponentFixture<ListsupportReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListsupportReclamationComponent]
    });
    fixture = TestBed.createComponent(ListsupportReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
