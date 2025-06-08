import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReclamationAdminComponent } from './update-reclamation-admin.component';

describe('UpdateReclamationAdminComponent', () => {
  let component: UpdateReclamationAdminComponent;
  let fixture: ComponentFixture<UpdateReclamationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateReclamationAdminComponent]
    });
    fixture = TestBed.createComponent(UpdateReclamationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
