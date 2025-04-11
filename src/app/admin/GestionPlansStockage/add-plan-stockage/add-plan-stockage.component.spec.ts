import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanStockageComponent } from './add-plan-stockage.component';

describe('AddPlanStockageComponent', () => {
  let component: AddPlanStockageComponent;
  let fixture: ComponentFixture<AddPlanStockageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanStockageComponent]
    });
    fixture = TestBed.createComponent(AddPlanStockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
