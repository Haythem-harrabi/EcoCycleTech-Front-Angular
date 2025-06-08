import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReclamationAdminComponent } from './list-reclamation-admin.component';

describe('ListReclamationAdminComponent', () => {
  let component: ListReclamationAdminComponent;
  let fixture: ComponentFixture<ListReclamationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListReclamationAdminComponent]
    });
    fixture = TestBed.createComponent(ListReclamationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
