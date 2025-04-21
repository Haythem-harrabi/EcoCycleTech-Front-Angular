import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRecycleComponent } from './demande-recycle.component';

describe('DemandeRecycleComponent', () => {
  let component: DemandeRecycleComponent;
  let fixture: ComponentFixture<DemandeRecycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeRecycleComponent]
    });
    fixture = TestBed.createComponent(DemandeRecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
