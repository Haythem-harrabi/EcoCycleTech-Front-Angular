import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportReclamationEditComponent } from './support-reclamation-edit.component';

describe('SupportReclamationEditComponent', () => {
  let component: SupportReclamationEditComponent;
  let fixture: ComponentFixture<SupportReclamationEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportReclamationEditComponent]
    });
    fixture = TestBed.createComponent(SupportReclamationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
