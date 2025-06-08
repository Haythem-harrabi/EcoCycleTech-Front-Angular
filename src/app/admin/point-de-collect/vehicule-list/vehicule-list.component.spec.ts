import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeListComponent } from './vehicule-list.component';

describe('VehiculeListComponent', () => {
  let component: VehiculeListComponent;
  let fixture: ComponentFixture<VehiculeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculeListComponent]
    });
    fixture = TestBed.createComponent(VehiculeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
