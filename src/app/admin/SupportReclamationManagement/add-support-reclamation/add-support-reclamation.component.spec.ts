import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupportReclamationComponent } from './add-support-reclamation.component';

describe('AddSupportReclamationComponent', () => {
  let component: AddSupportReclamationComponent;
  let fixture: ComponentFixture<AddSupportReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSupportReclamationComponent]
    });
    fixture = TestBed.createComponent(AddSupportReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
